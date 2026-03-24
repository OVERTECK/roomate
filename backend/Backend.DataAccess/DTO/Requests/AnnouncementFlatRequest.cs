using System.ComponentModel;
using System.Text.Json.Serialization;
using Backend.DataAccess.Entities;

namespace Backend.API.DTO;

public record AnnouncementFlatRequest
{
    public string? Description { get; set; }
    public string Country { get; set; } = "Россия";
    public string City { get; set; }
    public string Street { get; set; }
    public string HouseNumber { get; set; }
    public bool HasGarage { get; set; }
    public int CountRooms { get; set; }
    public int CreatedHouse { get; set; } = 2026;
    public int Floor { get; set; }
    public string MainPhotoUrl { get; set; }
    public int Price { get; set; }
    public bool HasLift { get; set; }
    public int MaxFloor { get; set; }
    public List<string> Photos { get; set; }
    public Guid CreatedUserId { get; set; }

    public required bool IsPayUtilities { get; set; }

    public required string FullAddress { get; set; }

    public required bool HasWashingMachine { get; init; }
    public required bool HasMicrowave { get; init; }
    public required bool HasStove { get; init; }
    public required bool HasFridge { get; init; }
    public int RequiredNumberNeighbors { get; init; } = 0;
}