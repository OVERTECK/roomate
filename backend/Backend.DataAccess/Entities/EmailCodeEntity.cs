using System.ComponentModel.DataAnnotations;

namespace Backend.DataAccess.Entities;

public class EmailCodeEntity
{
    public Guid Id { get; set; }
    
    [MaxLength(100)]
    public required string Email { get; set; }
    
    [MaxLength(10)]
    public required string Code { get; set; }

    public bool IsSuccess { get; set; } = false;
    
    public int AmountRequests { get; set; } = 0;
    
    public int AmountVerificationAttempts { get; set; } = 0;
    
    public DateTime VerificationBlockedUntil { get; set; }
    
    public DateTime UpdatedAt { get; set; }
}