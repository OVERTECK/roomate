using System.Security.Claims;
using Backend.API.DTO;
using Backend.API.Services;
using Backend.DataAccess.DTO.Responses;
using Backend.DataAccess.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersAnnouncementsController(
    ILogger<UsersAnnouncementsController> logger,
    UsersAnnouncementsService usersAnnouncementsService,
    IValidator<UserAnnouncementRequest> validator) : Controller
{
    [HttpGet]
    public async Task<ActionResult<List<UserAnnouncementEntity>>> GetUserAnnouncementsByCity([FromQuery] string city)
    {
        try
        {
            var announcements = await usersAnnouncementsService.GetByCity(city);

            return Ok(announcements);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return StatusCode(500, "Server error");
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserAnnouncementEntity>> GetById(Guid id)
    {
        try
        {
            var announcement = await usersAnnouncementsService.GetById(id);

            if (announcement == null) return NotFound();

            return Ok(announcement);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return StatusCode(500, "Server error");
        }
    }

    [HttpGet("user/{id:guid}")]
    public async Task<ActionResult<UserAnnouncementEntity>> GetByUserId(Guid id)
    {
        try
        {
            var announcement = await usersAnnouncementsService.GetByUserId(id);

            return Ok(announcement);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return StatusCode(500, "Server error");
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult> CreateUserAnnouncement(
        [FromBody] UserAnnouncementRequest announcementRequest)
    {
        try
        {
            var validateResult = await validator.ValidateAsync(announcementRequest);

            if (!validateResult.IsValid)
            {
                return Ok(new ResponseServer(310, validateResult.Errors[0].ErrorMessage));
            }

            var newUserAnnouncement = new UserAnnouncementEntity
            {
                Id = Guid.NewGuid(),
                City = announcementRequest.City,
                Price = announcementRequest.Price,
                Description = announcementRequest.Description,
                Name = announcementRequest.Name,
                Surname = announcementRequest.Surname,
                MainPhotoUrl = announcementRequest.MainPhotoUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedUserId = Guid.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value)
            };

            await usersAnnouncementsService.AddAsync(newUserAnnouncement);

            return Ok(new ResponseServer(200, "Successfully added announcement"));
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return StatusCode(500, "Server error");
        }
    }

    [Authorize]
    [HttpPatch("{id:guid}")]
    public async Task<ActionResult> UpdateUserAnnouncement(
        [FromBody] UserAnnouncementEditRequest announcementEditRequest, Guid id)
    {
        try
        {
            var validateResult = await validator.ValidateAsync(announcementEditRequest);

            if (!validateResult.IsValid)
            {
                return BadRequest(new ResponseServer(310, validateResult.Errors[0].ErrorMessage));
            }

            await usersAnnouncementsService.UpdateAsync(announcementEditRequest);

            return Ok(new ResponseServer(200, "Successfully updated announcement"));

        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
            return StatusCode(500, "Server error");
        }
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteUserAnnouncement(Guid id)
    {
        try
        {
            var result = await usersAnnouncementsService.DeleteAsync(id);

            if (result == 0) return NotFound();

            return Ok(new ResponseServer(200, "Successfully deleted announcement"));
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return Ok(new ResponseServer(500, "Error"));
        }
    }
}