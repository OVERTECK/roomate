namespace Backend.DataAccess.Entities;

public class HouseEntity
{
    public Guid Id { get; init; }
    
    public HouseAnnouncementEntity? AnnouncementId { get; init; }
    
    public required UserEntity User { get; init; }
}