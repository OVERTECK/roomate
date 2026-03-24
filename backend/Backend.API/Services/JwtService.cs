using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.API.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Backend.API.Services;

public class JwtService(IOptions<JwtOptions> jwtOptions) : IJwtService
{
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;
    public string GetToken(Guid userId)
    {
        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)),
            SecurityAlgorithms.HmacSha256);

        Claim[] claims = [new(ClaimTypes.NameIdentifier, userId.ToString())];
        
        var jwt = new JwtSecurityToken(
            signingCredentials: signingCredentials,
            // issuer: _jwtOptions.
            expires: DateTime.Now.AddHours(14),
            claims: claims);
        
        var token = new JwtSecurityTokenHandler().WriteToken(jwt);
        
        return token;
    }
}