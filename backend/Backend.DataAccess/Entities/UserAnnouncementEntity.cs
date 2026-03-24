using System.ComponentModel.DataAnnotations;

namespace Backend.DataAccess.Entities;

public class UserAnnouncementEntity
{
    public Guid Id { get; init; }
    
    [MaxLength(100)]
    public string? Name { get; init; }
    
    [MaxLength(100)]
    public string? Surname { get; init; }
    
    [MaxLength(500)]
    public string? Description { get; init; }

    [MaxLength(50)] 
    public string Country { get; init; } = "Россия";
    
    [MaxLength(50)]
    public required string City { get; init; }
    
    public bool HasGarage { get; init; }
    
    public required DateTime CreatedAt { get; init; }
    
    public required DateTime UpdatedAt { get; init; }
    
    public required int Price { get; init; }
    
    [MaxLength(500)]
    public required string MainPhotoUrl { get; init; }

    public required Guid CreatedUserId { get; init; }
    
    public UserEntity? CreatedUser { get; init; }
}