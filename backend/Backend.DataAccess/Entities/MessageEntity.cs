using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.DataAccess.Entities;

public class MessageEntity
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public DateTime CreatedAt { get; set; }

    [MaxLength(1000)]
    public string Text { get; set; }

    public bool IsRead { get; set; } = false;

    public Guid ChatId { get; set; }

    [JsonIgnore]
    public ChatEntity? Chat { get; set; }
}