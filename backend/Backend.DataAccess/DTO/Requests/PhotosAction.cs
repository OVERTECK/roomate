namespace Backend.API.DTO;

public class PhotosAction
{
    public Guid? Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public required string UrlToImage { get; set; }
    public int? Order { get; set; }
    
    public Guid AnnouncementId { get; set; }
}