namespace Backend.API.Abstractions;

public interface IEmailSenderService
{
    public Task SendMessageOnEmail(string email, string message);
}