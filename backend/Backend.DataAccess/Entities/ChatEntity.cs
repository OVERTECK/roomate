using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.DataAccess.Entities;

public class ChatEntity
{
    public Guid Id { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    [MaxLength(100)]
    public string? LastMessage { get; set; }

    public List<MessageEntity> Messages { get; set; } = [];
}