using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("[controller]")]
public class LogoutController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Logout()
    {
        Response.Cookies.Delete("token");
        
        return Ok();
    }
}