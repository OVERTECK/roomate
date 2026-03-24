namespace Backend.DataAccess.DTO.Responses;

public class UserResponse
{
    public Guid Id { get; init; }
    
    public required string Surname { get; init; }
    
    public required string Name { get; init; }
    
    public string? Patronymic { get; init; }
    
    public required int? Age { get; init; }
    
    public required DateOnly CreatedAccount { get; init; }
    
    public string? Country { get; init; }
    
    public string? City { get; init; }

    public bool? IsAdmin { get; init; } = false;
    
    public string? PhotoUrl { get; init; }
    
    public string? PhoneNumber { get; init; }
}