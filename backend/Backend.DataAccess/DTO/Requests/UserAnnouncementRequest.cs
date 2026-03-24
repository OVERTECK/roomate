namespace Backend.API.DTO;

public class UserAnnouncementRequest
{
    public string? Description { get; init; }
    
    public string Surname { get; init; }
    
    public string Name { get; init; }

    public required string City { get; init; }
    
    public required int Price { get; init; }
    
    public required string MainPhotoUrl { get; init; }
}