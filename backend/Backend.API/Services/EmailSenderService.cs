using Backend.API.Abstractions;
using MailKit.Net.Smtp;
using MimeKit;

namespace Backend.API.Services;

public class EmailSenderService : IEmailSenderService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailSenderService> _logger;

    public EmailSenderService(IConfiguration configuration, ILogger<EmailSenderService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendMessageOnEmail(string email, string message)
    {
        var emailSettings = _configuration.GetSection("EmailSettings");

        using var client = new SmtpClient();

        await client.ConnectAsync(
            emailSettings["SmtpServer"],
            int.Parse(emailSettings["Port"]),
            bool.Parse(emailSettings["UseSSL"])
        );

        _logger.LogInformation($"Подключение к SMTP-серверу {emailSettings["SmtpServer"]}:{emailSettings["Port"]} установлено." +
                                   $"Используется SSL: {emailSettings["UseSSL"]}");

        await client.AuthenticateAsync(
            emailSettings["Username"],
            emailSettings["Password"]);

        var emailMessage = new MimeMessage();

        emailMessage.From.Add(
            new MailboxAddress(
                emailSettings["Username"],
                emailSettings["SenderEmail"]));

        emailMessage.To.Add(new MailboxAddress("", email));
        emailMessage.Subject = $"Ваш проверочный код Roomate - {message}";
        emailMessage.Body = new TextPart("plain")
        {
            Text = $"Проверочный код. Введите этот код на экране проверки пользователя: {message}"
        };

        await client.SendAsync(emailMessage);
        await client.DisconnectAsync(true);
    }
}