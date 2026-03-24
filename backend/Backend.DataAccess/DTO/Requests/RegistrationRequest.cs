using System.ComponentModel.DataAnnotations;

namespace Backend.API.DTO;

public record RegistrationRequest(
    string Email,
    string? PhoneNumber,
    string? Surname,
    string? Patronymic,
    string? Name,
    int? Age,
    string? Country,
    string? City,
    string? PhotoUrl,
    string? Password
);