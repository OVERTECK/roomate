using System.ComponentModel.DataAnnotations;

namespace Backend.API.DTO;

public record LoginRequest(
    [Required] string Email,
    [Required] string Password);