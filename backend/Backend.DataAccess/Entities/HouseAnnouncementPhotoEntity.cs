using System.Buffers.Text;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.DataAccess.Entities;

public class HouseAnnouncementPhotoEntity
{
    public Guid Id { get; init; }
    
    public Guid HouseAnnouncementId { get; init; }
    
    [JsonIgnore]
    public HouseAnnouncementEntity HouseAnnouncement { get; init; }
    
    [MaxLength(300)]
    public required string UrlToImage { get; init; }
}