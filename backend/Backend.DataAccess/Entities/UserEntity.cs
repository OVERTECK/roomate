using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.DataAccess.Entities;

public class UserEntity
{
    public Guid Id { get; set; }

    [MaxLength(50)]
    public required string Email { get; set; }

    [MaxLength(100)]
    public required string? HashedPassword { get; set; }

    public int AmountAttemptsLogin { get; set; } = 0;

    public DateTime? BlockedLoginUntil { get; set; }

    [MaxLength(20)]
    public required string? PhoneNumber { get; set; }

    [MaxLength(50)]
    public required string? Surname { get; set; } = "";

    [MaxLength(50)]
    public required string? Name { get; set; } = "";

    [MaxLength(50)]
    public required string? Patronymic { get; set; }

    public required int? Age { get; set; }

    public required DateOnly CreatedAccount { get; set; }

    [MaxLength(50)]
    public string? Country { get; set; }

    [MaxLength(50)]
    public string? City { get; set; }

    public bool? IsAdmin { get; set; } = false;

    [MaxLength(200)] public string? PhotoUrl { get; set; } = "/default_user_img.png";

    [JsonIgnore]
    public List<HouseAnnouncementEntity>? HouseAnnouncements { get; set; }

    [JsonIgnore]
    public List<FlatEntity>? Flats { get; set; }

    [JsonIgnore]
    public List<HouseEntity>? Houses { get; set; }
}