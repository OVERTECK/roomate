namespace Backend.API.Abstractions;

public interface IEmailVerificationService
{
    public Task SendVerificationEmail(string email);
    
    public Task<bool> CheckCode(string email, string code);
}