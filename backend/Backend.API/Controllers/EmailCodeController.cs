using Backend.API.Abstractions;
using Backend.API.Services;
using Backend.DataAccess.DTO.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
public class EmailCodeController(
    ILogger<EmailCodeController> logger,
    IEmailVerificationService emailVerificationService) : Controller
{
    [HttpPost("email/sendCode")]
    public async Task<IResult> SendCode([FromBody] string email)
    {
        try
        {
            await emailVerificationService.SendVerificationEmail(email);

            return Results.Ok(new
            {
                Code = 200,
                Message = "Success"
            });
        }
        catch (ArgumentException ex)
        {
            logger.LogError(ex.Message);

            return Results.Ok(new ResponseServer(400, ex.Message));
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return Results.InternalServerError();
        }
    }

    public record CodeCheckRequest(string Email, string Code);

    [HttpPost("email/checkCode")]
    public async Task<IResult> CheckCode([FromBody] CodeCheckRequest request)
    {
        try
        {
            var result = await emailVerificationService.CheckCode(request.Email, request.Code);

            return Results.Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return Results.InternalServerError();
        }
    }
}