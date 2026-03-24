using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.DataAccess.Entities;

public class HouseAnnouncementEntity
{
    public Guid Id { get; init; }

    [MaxLength(500)]
    public string? Description { get; init; }

    [MaxLength(50)]
    public required string Country { get; init; }

    [MaxLength(50)]
    public required string City { get; init; }

    [MaxLength(50)]
    public required string Street { get; init; }

    [MaxLength(50)]
    public required string HouseNumber { get; init; }

    public bool HasGarage { get; init; }

    public required DateTime CreatedAt { get; init; }

    public required DateTime UpdatedAt { get; init; }

    public required int CreatedHouse { get; init; }

    public required int CountRooms { get; init; }

    public bool HasLift { get; init; }

    public int MaxFloor { get; init; }
    public required int Price { get; init; }

    public required bool IsPayUtilities { get; set; }

    [MaxLength(500)]
    public required string MainPhotoUrl { get; init; }
    public required List<HouseAnnouncementPhotoEntity> Photos { get; init; }
    public required Guid CreatedUserId { get; init; }

    public UserEntity? CreatedUser { get; init; }

    [MaxLength(200)]
    public required string FullAddress { get; init; }
    public required int Floor { get; init; }
    public required bool HasWashingMachine { get; init; }
    public required bool HasMicrowave { get; init; }
    public required bool HasStove { get; init; }
    public required bool HasFridge { get; init; }
    public int RequiredNumberNeighbors { get; init; } = 0;
}