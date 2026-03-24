namespace Backend.API.DTO;

public record CreateFlatRequest
{
    public required int Floor { get; set; }
    
    public required Guid UserId { get; set; }
}