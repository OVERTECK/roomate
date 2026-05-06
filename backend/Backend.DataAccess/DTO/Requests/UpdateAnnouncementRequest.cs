namespace Backend.API.DTO;

public class UpdateAnnouncementRequest : AnnouncementFlatRequest
{
    public Guid Id { get; set; }
}