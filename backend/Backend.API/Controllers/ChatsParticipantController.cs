using System.Security.Claims;
using Backend.API.DTO;
using Backend.API.Services;
using Backend.DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class ChatsController(
    ChatsService chatsService,
    ChatsParticipantService chatsParticipantService,
    ILogger<ChatsController> logger
    ) : ControllerBase
{
    [Authorize]
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<ChatParticipantEntity>>> GetByUserId(Guid userId)
    {
        try
        {
            var userIdFromCookies = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId.ToString() != userIdFromCookies) return Unauthorized();

            var chats = await chatsParticipantService.GetByUserIdAsync(userId);

            return Ok(chats);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return Problem("Server error");
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ChatParticipantEntity>> Create([FromBody] ChatParticipantRequest chatParticipantRequest)
    {
        try
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != chatParticipantRequest.UserId.ToString()) return Unauthorized();

            var searchedChatParticipant = await chatsParticipantService.GetExistingParticipant(
                chatParticipantRequest.UserId,
                chatParticipantRequest.ReceiveUserId);

            if (searchedChatParticipant == null)
            {
                return NoContent();
            }

            var newChat = await chatsService.AddAsync(new ChatEntity
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
            });

            var chatParticipant = await chatsParticipantService.Create(new ChatParticipantEntity
            {
                Id = Guid.NewGuid(),
                ChatId = newChat.Id,
                ReceiverUserId = chatParticipantRequest.ReceiveUserId,
                JoinedAt = DateTime.UtcNow,
                UserId = chatParticipantRequest.UserId,
            });

            await chatsParticipantService.Create(new ChatParticipantEntity
            {
                Id = Guid.NewGuid(),
                ChatId = newChat.Id,
                JoinedAt = DateTime.UtcNow,
                ReceiverUserId = chatParticipantRequest.UserId,
                UserId = chatParticipantRequest.ReceiveUserId,
            });

            return Ok(chatParticipant);

        }
        catch (Exception)
        {
            return Problem("Server error");
        }
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await chatsService.DeleteAsync(id);

            return Ok();
        }
        catch (Exception)
        {
            return Problem("Server error");
        }
    }
}