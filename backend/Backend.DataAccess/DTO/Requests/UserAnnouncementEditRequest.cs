namespace Backend.API.DTO;

public class UserAnnouncementEditRequest : UserAnnouncementRequest
{
    public Guid Id { get; init; }
    
    public string Country { get; init; } = "Россия";
}