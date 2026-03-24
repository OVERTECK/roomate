using Backend.API.Services;
using Microsoft.AspNetCore.Mvc;
using Backend.DataAccess.DTO.Responses;
using LoginRequest = Backend.API.DTO.LoginRequest;

namespace Backend.API.Controllers;

[ApiController]
[Route("[controller]")]
public class LoginController(
    UsersService usersService,
    ILogger<LoginController> logger) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest loginRequest)
    {
        try
        {
            var token = await usersService.Login(loginRequest.Email, loginRequest.Password);

            var user = await usersService.GetByEmail(loginRequest.Email);

            var userResponse = new UserResponse
            {
                Age = user.Age,
                City = user.City,
                Country = user.Country,
                CreatedAccount = user.CreatedAccount,
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
            };

            Response.Cookies.Append("token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
            });

            return Ok(new
            {
                token,
                userResponse
            });
        }
        catch (ArgumentException ex)
        {
            logger.LogError(ex.Message);
            
            return BadRequest();
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
            
            return Unauthorized();
        }
    }
}