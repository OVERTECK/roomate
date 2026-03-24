using Backend.DataAccess;
using Backend.DataAccess.Entities;

namespace Backend.API.Services;

public class MessagesService(MyDbContext dbContext)
{
    public async Task<MessageEntity> AddAsync(MessageEntity messageEntity)
    {
        await dbContext.Messages.AddAsync(messageEntity);
        
        await dbContext.SaveChangesAsync();
        
        return messageEntity;
    }
}