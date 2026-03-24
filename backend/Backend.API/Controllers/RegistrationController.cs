using Microsoft.AspNetCore.Mvc;
using Backend.API.DTO;
using Backend.API.Services;
using Backend.DataAccess.Repositories;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.API.Controllers;

[ApiController]
[Route("[controller]")]
public class RegistrationController(
    UsersService usersService,
    IValidator<RegistrationRequest> validator,
    ILogger<RegistrationController> logger,
    EmailCodesService emailCodesService) : ControllerBase
{
    [HttpPost]
    public async Task<IResult> Registration([FromBody] RegistrationRequest registrationUser)
    {
        try
        {
            logger.LogInformation($"Registration user {registrationUser}");

            var validationResult = await validator.ValidateAsync(registrationUser);

            if (!validationResult.IsValid)
            {
                return Results.BadRequest(validationResult.Errors[0].ErrorMessage);
            }
            
            var emailCode = await emailCodesService.GetByEmailCodeAsync(registrationUser.Email);

            if (emailCode is not { IsSuccess: true })
            {
                return Results.BadRequest("Error. Confirm email!");
            }
            
            var isExistEmail = await usersService.IsExistByEmail(registrationUser.Email);
            
            if (isExistEmail)
            {
                logger.LogInformation($"Email {registrationUser.Email} already exist");
                
                return Results.BadRequest("Почта занята!");
            }
            
            var token = await usersService.Registration(registrationUser);
            
            var user = await usersService.GetByEmail(registrationUser.Email);
            
            Response.Cookies.Append("token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
            });

            return Results.Ok(new
            {
                token,
                user = new
                {
                    Id = user.Id,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Name = user.Name,
                    Surname = user.Surname,
                }
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);
            
            return Results.InternalServerError();
        }
    }
}