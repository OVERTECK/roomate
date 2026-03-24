using System.ComponentModel.DataAnnotations;
using Backend.DataAccess.Entities;

namespace Backend.DataAccess.DTO.Responses;

public class CreatedUserResponse
{
    public required Guid Id { get; set; }
    public required string Surname { get; set; }
    public required string Name { get; set; }
    public string? Patronymic { get; set; }
    public string? PhotoUrl { get; set; }
    public required int? Age { get; set; }
}

public record AnnouncementResponse
{
    public required Guid Id { get; set; }
    public required string Country { get; set; }
    public required string City { get; set; }
    public required string Street { get; set; }
    public required string HouseNumber { get; set; }
    public required bool HasGarage { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required DateTime UpdatedAt { get; set; }
    public required int CreatedHouse { get; set; }
    public required int CountRooms { get; set; }
    public required bool HasLift { get; set; }
    public required int MaxFloor { get; set; }
    public required int Price { get; set; }
    public required string MainPhotoUrl { get; set; }
    public required string FullAddress { get; set; }
    public required List<string> PhotosUrls { get; set; }
    public required List<HouseAnnouncementPhotoEntity> Photos { get; set; }
    public required int Floor { get; set; }
    public required CreatedUserResponse CreatedUser { get; set; }
    public required Guid CreatedUserId { get; set; }
    public required bool HasWashingMachine { get; init; }
    public required bool HasMicrowave { get; init; }
    public required bool HasStove { get; init; }
    public required bool HasFridge { get; init; }
    public int RequiredNumberNeighbors { get; init; } = 0;
}