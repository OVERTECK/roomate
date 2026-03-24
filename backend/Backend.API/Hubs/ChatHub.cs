using Backend.API.Services;
using Backend.DataAccess.DTO.Responses;
using Backend.DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Backend.API.Hubs;

public record Message(
    Guid ChatId,
    Guid UserId,
    string Text);

[Authorize]
public class ChatHub(
    ChatsParticipantService chatsParticipantService,
    ChatsService chatsService,
    MessagesService messagesService,
    ILogger<ChatHub> logger) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var getUserId = Context.UserIdentifier;

        if (getUserId == null)
        {
            return;
        }
        
        var userId = Guid.Parse(getUserId);

        var userChats = await chatsParticipantService.GetByUserIdAsync(userId);
        
        foreach (var chat in userChats)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"chat_{chat.ChatId}");
        }
        
        logger.LogInformation($"User {userId} joined the chat {userChats.Count()} chats");
        
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        
        await base.OnConnectedAsync();
    }

    public async Task JoinChat(Guid chatId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"chat_{chatId}");
    }

    public async Task SendNotification(Guid userId)
    {
        await Clients.Group($"user_{userId}")
            .SendAsync("ReceiveNotification");
    }
    
    public async Task SendMessage(Message message)
    {
        var getChatParticipant = await chatsService.GetByIdAsync(message.ChatId);

        if (getChatParticipant != null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"chat_{message.ChatId}");
        }

        var newMessage = new MessageEntity
        {
            Id = Guid.NewGuid(),
            Text = message.Text,
            UserId = message.UserId,
            CreatedAt = DateTime.UtcNow,
            ChatId = message.ChatId,
            IsRead = false,
        };
        
        await messagesService.AddAsync(newMessage);
        
        await Clients.Group($"chat_{message.ChatId.ToString()}")
            .SendAsync("ReceiveMessage", newMessage);
    }

    public record CreateChatRequest(Guid UserId, Guid ReceiveUserId);
    
    public async Task CreateChat(CreateChatRequest chatRequest)
    {
        try
        {
            var getChatParticipant = await chatsParticipantService.GetExistingParticipant(
                chatRequest.UserId,
                chatRequest.ReceiveUserId);
            
            if (getChatParticipant != null)
            {
                await Clients.Group($"chat_{getChatParticipant.ChatId.ToString()}")
                    .SendAsync("ReceiveChat", getChatParticipant);
                
                return;
            }
            
            var newChat = new ChatEntity
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
            };
            
            await chatsService.AddAsync(newChat);

            var newChatParticipantUser = await chatsParticipantService.Create(new ChatParticipantEntity
            {
                Id = Guid.NewGuid(),
                ChatId = newChat.Id,
                ReceiverUserId = chatRequest.ReceiveUserId,
                JoinedAt = DateTime.UtcNow,
                UserId = chatRequest.UserId,
            });
            
            var newChatParticipant = await chatsParticipantService.Create(new ChatParticipantEntity
            {
                Id = Guid.NewGuid(),
                ChatId = newChat.Id,
                JoinedAt = DateTime.UtcNow,
                ReceiverUserId = chatRequest.UserId,
                UserId = chatRequest.ReceiveUserId,
            });

            var responseChatParticipant = await chatsParticipantService.GetByIdAsync(newChatParticipant.Id);
        
            var responseChatParticipantUser = await chatsParticipantService.GetByIdAsync(newChatParticipantUser.Id);
            
            await Clients.User(chatRequest.ReceiveUserId.ToString())
                .SendAsync("ReceiveChat", responseChatParticipant);
            
            await Clients.User(chatRequest.UserId.ToString())
                .SendAsync("ReceiveChat", responseChatParticipantUser);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
        }
    }
}