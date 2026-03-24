using System.Text.Json.Serialization;

namespace Backend.DataAccess.Entities;

public class FlatEntity
{
    public Guid Id { get; init; }
    
    public int Floor  { get; init; }
    
    public Guid? AnnouncementId { get; init; }
    
    public required Guid UserId { get; init; }
    
    [JsonIgnore]
    public UserEntity? User { get; init; }
}