using Backend.DataAccess;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Services;

public class ChatsParticipantService(MyDbContext dbContext)
{
    public async Task<ChatParticipantEntity?> GetByIdAsync(Guid id)
    {
        var searchedChatParticipant = await dbContext
            .ChatParticipants
            .AsNoTracking()
            .Include(c => c.Chat)
            .Include(c => c.ReceiverUser)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (searchedChatParticipant == null)
        {
            throw new ArgumentException("Chat participant not found");
        }
            
        return searchedChatParticipant;
    }
    
    public async Task<List<ChatParticipantEntity>> GetByUserIdAsync(Guid userId)
    {
        var searchedChats = await dbContext
            .ChatParticipants
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .Include(c => c.Chat)
                .ThenInclude(x => x.Messages
                .OrderBy(m => m.CreatedAt))
            .Include(c => c.ReceiverUser)
            .ToListAsync();

        return searchedChats;
    }
    
    public async Task<ChatParticipantEntity> Create(ChatParticipantEntity entity)
    {
        await dbContext.ChatParticipants.AddAsync(entity);
        
        await dbContext.SaveChangesAsync();
        
        return entity;
    }

    public async Task<ChatParticipantEntity?> GetExistingParticipant(Guid userId, Guid receiveUserId)
    { 
        var chatParticipant = await dbContext
            .ChatParticipants
            .Include(c => c.Chat)
                .ThenInclude(x => x.Messages)
            .Include(c => c.ReceiverUser)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => 
                (c.UserId == userId && c.ReceiverUserId == receiveUserId) ||
                (c.ReceiverUserId == receiveUserId && c.ReceiverUserId == userId));

        return chatParticipant;
    }
}