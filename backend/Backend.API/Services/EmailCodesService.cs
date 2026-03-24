using Backend.DataAccess;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Services;

public class EmailCodesService
{
    private readonly MyDbContext _dbContext;

    public EmailCodesService(MyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<EmailCodeEntity?> GetByEmailCodeAsync(string email)
    {
        var codeEntity = await _dbContext.EmailCodes.FirstOrDefaultAsync(c => c.Email == email);

        return codeEntity;
    }

    public async Task<EmailCodeEntity> AddAsync(EmailCodeEntity entity)
    {
        var addedEntity = await _dbContext.EmailCodes.AddAsync(entity);
        
        await _dbContext.SaveChangesAsync();
        
        return addedEntity.Entity;
    }

    public async Task UpdateCodeByEmailAsync(string email, string code)
    {
        await _dbContext
            .EmailCodes
            .Where(c => c.Email == email)
            .ExecuteUpdateAsync(c => c
                .SetProperty(x => x.Code, code)
                .SetProperty(x => x.UpdatedAt, DateTime.UtcNow)
                .SetProperty(x => x.IsSuccess, false)
                .SetProperty(x => x.AmountRequests, x => x.AmountRequests > 5 ? 0 : x.AmountRequests + 1)
            );
    }

    public async Task UpdateAsync(EmailCodeEntity entity)
    {
        await _dbContext
            .EmailCodes
            .Where(c => c.Email == entity.Email)
            .ExecuteUpdateAsync(c => c
                .SetProperty(x => x.AmountRequests, entity.AmountRequests)
                .SetProperty(x => x.AmountVerificationAttempts, entity.AmountVerificationAttempts)
                .SetProperty(x => x.IsSuccess, entity.IsSuccess)
                .SetProperty(x => x.Code, entity.Code)
                .SetProperty(x => x.UpdatedAt, entity.UpdatedAt)
                .SetProperty(x => x.Email, entity.Email)
                .SetProperty(x => x.VerificationBlockedUntil, entity.VerificationBlockedUntil));
    }
}