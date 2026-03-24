using System.Security.Claims;
using Backend.API.Services;
using Backend.DataAccess.DTO.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class GetMeController(ILogger<GetMeController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Login(UsersService usersService)
    {
        try
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null) return Unauthorized();

            var user = await usersService.GetById(Guid.Parse(userId));

            var userResponse = new UserResponse
            {
                Age = user.Age,
                City = user.City,
                Country = user.Country,
                CreatedAccount = user.CreatedAccount,
                Id = user.Id,
                IsAdmin = user.IsAdmin,
                Name = user.Name,
                Patronymic = user.Patronymic,
                PhotoUrl = user.PhotoUrl,
                Surname = user.Surname,
                PhoneNumber = user.PhoneNumber,
            };

            return Ok(userResponse);
        }
        catch (NullReferenceException ex)
        {
            logger.LogError(ex, ex.Message);

            return Unauthorized();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Unauthorized("Error");
        }
    }
}