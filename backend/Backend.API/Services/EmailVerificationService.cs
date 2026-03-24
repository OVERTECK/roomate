using Backend.API.Abstractions;
using Backend.DataAccess.Entities;

namespace Backend.API.Services;

public class EmailVerificationService : IEmailVerificationService
{
    private readonly IEmailSenderService _emailSenderService;
    private readonly EmailCodesService _emailCodesService;

    public EmailVerificationService(
        IEmailSenderService emailSenderService,
        EmailCodesService emailCodesService)
    {
        _emailSenderService = emailSenderService;
        _emailCodesService = emailCodesService;
    }
    
    public async Task SendVerificationEmail(string email)
    {
        const int MAX_AMOUNT_REQUESTS_FOR_5_MIN = 5;
        
        var random = new Random();
        
        var randomCode = random.Next(10000, 99999).ToString();

        var emailCodeEntity = await _emailCodesService.GetByEmailCodeAsync(email);

        if (emailCodeEntity == null)
        {
            var addedEmailCode = await _emailCodesService.AddAsync(new EmailCodeEntity
            {
                Id = Guid.NewGuid(),
                Code = randomCode,
                Email = email,
                UpdatedAt = DateTime.UtcNow
            });
            
            await _emailSenderService.SendMessageOnEmail(email, randomCode);
            
            return;
        }

        if (emailCodeEntity.VerificationBlockedUntil > DateTime.UtcNow)
        {
            throw new ArgumentException("Слишком много запросов. Попробуйте позже.");
        }
        
        if (emailCodeEntity.AmountRequests > MAX_AMOUNT_REQUESTS_FOR_5_MIN)
        {
            emailCodeEntity.AmountRequests = 0;
            emailCodeEntity.VerificationBlockedUntil = DateTime.UtcNow.AddMinutes(10);
            
            await _emailCodesService.UpdateAsync(emailCodeEntity);
            
            throw new ArgumentException("Слишком много запросов. Попробуйте позже.");
        }
        
        emailCodeEntity.IsSuccess = false;
        
        await _emailCodesService.UpdateCodeByEmailAsync(email, randomCode);
        
        await _emailSenderService.SendMessageOnEmail(email, randomCode);
    }

    public async Task<bool> CheckCode(string email, string code)
    {
        const int MAX_AMOUNT_VERIFICATION_ATTEMPTS = 6;
        
        var searchedCodeEmail = await _emailCodesService.GetByEmailCodeAsync(email);

        if (searchedCodeEmail == null)
        {
            return false;
        }

        var codeIsSuccess = searchedCodeEmail.Code == code 
                            && searchedCodeEmail.UpdatedAt.AddMinutes(5) > DateTime.UtcNow
                            && !searchedCodeEmail.IsSuccess;

        if (searchedCodeEmail.VerificationBlockedUntil > DateTime.UtcNow)
        {
            return false;
        }
        
        if (searchedCodeEmail.AmountVerificationAttempts > MAX_AMOUNT_VERIFICATION_ATTEMPTS)
        {
            searchedCodeEmail.AmountVerificationAttempts = 0;
            searchedCodeEmail.VerificationBlockedUntil = DateTime.UtcNow.AddMinutes(10);
            
            await _emailCodesService.UpdateAsync(searchedCodeEmail);
            
            return false;
        }
        
        if (!codeIsSuccess)
        {
            searchedCodeEmail.AmountVerificationAttempts++;
            
            await _emailCodesService.UpdateAsync(searchedCodeEmail);
            
            return false;
        }

        searchedCodeEmail.AmountVerificationAttempts = 0;
        searchedCodeEmail.AmountRequests = 0;
        searchedCodeEmail.UpdatedAt = DateTime.UtcNow;
        searchedCodeEmail.IsSuccess = true;
        
        await _emailCodesService.UpdateAsync(searchedCodeEmail);
            
        return true;
    }
}