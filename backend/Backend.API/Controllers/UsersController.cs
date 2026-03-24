using Backend.API.DTO;
using Backend.API.Services;
using Backend.DataAccess.DTO.Responses;
using Backend.DataAccess.Repositories;
using Backend.DataAccess.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.API.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController(
    UserRepository userRepository,
    UsersService usersService,
    IValidator<UpdateUserRequest> validator,
    ILogger<UsersController> logger) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserResponse?>> GetById(Guid id)
    {
        var searchedUser = await usersService.GetById(id);

        if (searchedUser == null) return NotFound();

        var userResponse = new UserResponse
        {
            Id = searchedUser.Id,
            Age = searchedUser.Age,
            Name = searchedUser.Name,
            Surname = searchedUser.Surname,
            City = searchedUser.City,
            Country = searchedUser.Country,
            CreatedAccount = searchedUser.CreatedAccount,
            IsAdmin = searchedUser.IsAdmin,
            Patronymic = searchedUser.Patronymic,
            PhotoUrl = searchedUser.PhotoUrl
        };

        return Ok(userResponse);
    }

    [Authorize]
    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<UserEntity>> Update(
        [FromBody] UpdateUserRequest user,
        Guid id)
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != user.Id.ToString()) return Unauthorized();

        var validateResult = await validator.ValidateAsync(user);

        if (!validateResult.IsValid)
        {
            return BadRequest(validateResult.Errors[0].ErrorMessage);
        }

        var responseUser = await usersService.Update(user);

        if (responseUser == null) return NotFound();

        return Ok();
    }
}