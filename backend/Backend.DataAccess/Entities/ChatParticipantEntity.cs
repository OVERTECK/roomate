using System.ComponentModel.DataAnnotations;

namespace Backend.DataAccess.Entities;

public class ChatParticipantEntity
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public Guid ReceiverUserId { get; set; }
    
    [Required]
    public Guid ChatId { get; set; }
    
    public DateTime JoinedAt { get; set; }
    
    public UserEntity? User { get; set; }
    
    public UserEntity? ReceiverUser { get; set; }
    
    public ChatEntity? Chat { get; set; }
}