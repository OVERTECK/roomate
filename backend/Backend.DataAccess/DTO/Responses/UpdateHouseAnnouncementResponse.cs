namespace Backend.DataAccess.DTO.Responses;

public class UpdateHouseAnnouncementResponse
{
    public Guid Id { get; init; }
    
    public required string? Description { get; init; }
    
    public required string Country { get; init; }
    
    public required string City { get; init; }
    
    public required string Street { get; init; }
    
    public required string HouseNumber { get; init; }
    
    public bool HasGarage { get; init; }
    
    public required int CreatedHouse { get; init; }
    
    public required int CountRooms { get; init; }
    
    public bool HasLift { get; init; }
    
    public int MaxFloor { get; init; }
    
    public required int Price { get; init; }
    
    public required bool IsPayUtilities { get; set; }
    
    public required string MainPhotoUrl { get; init; }
    
    public required List<string> Photos { get; init; }
    
    public required Guid CreatedUserId { get; init; }
}