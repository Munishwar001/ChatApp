using App.core.DTOs.Chat;

namespace App.Application.Interfaces
{
    public interface IChatRepository
    {
        Task<List<MessageDto>> getMessage(Guid chatId);
        Task<string> createOrGetChat(CreateChatRequest req);
        Task<MessageDto> SendMessage(SendMessageRequest req);
    }
}