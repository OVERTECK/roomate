using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
public class GoogleOAuthController(IConfiguration configuration) : ControllerBase
{
    [HttpGet("signin-google")]
    public IActionResult SignInGoogle()
    {
        return Challenge(new AuthenticationProperties
        {
            RedirectUri = configuration["Urls:Front"],
        }, GoogleDefaults.AuthenticationScheme);
    }
}