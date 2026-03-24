using Backend.DataAccess;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Services;

public class ChatsService(MyDbContext dbContext)
{
    public async Task<List<ChatEntity>> GetAllAsync()
    {
        return await dbContext.Chats.AsNoTracking().ToListAsync();
    }

    public async Task<ChatEntity?> GetByIdAsync(Guid chatId)
    {
        var searchedChat = await dbContext
            .Chats
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == chatId);
        
        return searchedChat;
    }

    public async Task<ChatEntity> AddAsync(ChatEntity chat)
    {
        await dbContext.Chats.AddAsync(chat);
        
        await dbContext.SaveChangesAsync();
        
        return chat;
    }

    public async Task DeleteAsync(Guid chatId)
    {
        var countDeletedRows = await dbContext
            .Chats
            .Where(c => c.Id == chatId)
            .ExecuteDeleteAsync();

        if (countDeletedRows == 0)
        {
            throw new ArgumentException($"Chat with id {chatId} not found");
        }
    }
}