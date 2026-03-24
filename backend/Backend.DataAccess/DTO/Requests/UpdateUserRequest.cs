namespace Backend.API.DTO;

public record UpdateUserRequest(
    Guid Id,
    string? Email,
    string? PhoneNumber,
    string? Surname,
    string? Name,
    string? Patronymic,
    int? Age,
    string? Country,
    string? City,
    string? PhotoUrl
);