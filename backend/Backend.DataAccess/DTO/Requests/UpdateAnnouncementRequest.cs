namespace Backend.API.DTO;

public record UpdateAnnouncementRequest : AnnouncementFlatRequest
{
    public Guid Id { get; set; }
    
    public string? Description { get; set; }
    
    public required string City { get; set; }
    
    public required string Street { get; set; }

    public required string HouseNumber { get; set; }
    
    public bool HasGarage { get; set; }
    
    public required int CreatedHouse { get; set; }
    
    public required int CountRooms { get; set; }
    
    public bool HasLift { get; set; }
    
    public int MaxFloor { get; set; }
    
    public required int Price { get; set; }
    
    public required string MainPhotoUrl { get; set; }
    
    public required List<string> Photos { get; set; }
    
    public Guid CreatedUserId { get; set; }
}