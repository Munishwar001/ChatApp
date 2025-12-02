using App.Application.Interfaces;
using App.core.DTOs.Chat;
using Dapper;
using System.Data;

namespace App.Infrastructure.DataAccess
{
    public class ChatRepository(IDbConnection connection) : IChatRepository
    {
        public async Task<List<MessageDto>> getMessage(Guid chatId)
        {
            string query = @"SELECT  MessageId, ChatId, SenderId, MessageText, MessageType, CreatedAt, IsDeleted, IsEdited
            FROM Messages  WHERE ChatId = @ChatId ORDER BY CreatedAt ASC";

            var messages = await connection.QueryAsync<MessageDto>(query, new { ChatId = chatId });

            return messages.ToList();
        }

        public async Task<string> createOrGetChat(CreateChatRequest req)
        {
            string checkChatSql = @"SELECT c.ChatId FROM Chats c JOIN ChatParticipants p1 ON c.ChatId = p1.ChatId JOIN ChatParticipants p2 ON c.ChatId = p2.ChatId WHERE 
            c.ChatType = 'individual' AND p1.UserId = @User1 AND p2.UserId = @User2;";

            var existingChatId = await connection.QueryFirstOrDefaultAsync<Guid?>(checkChatSql, new { req.User1, req.User2 });

            if (existingChatId != null)
                return existingChatId.ToString();

            var newChatId = Guid.NewGuid();
            string insertChatSql = "INSERT INTO Chats (ChatId, ChatType) VALUES (@ChatId, @ChatType);";
            await connection.ExecuteAsync(insertChatSql, new { ChatId = newChatId, ChatType = "individual" });

            string insertParticipantsSql = @"INSERT INTO ChatParticipants (ChatId, UserId) VALUES (@ChatId, @User1);
            INSERT INTO ChatParticipants (ChatId, UserId) VALUES (@ChatId, @User2);";
            
            await connection.ExecuteAsync(insertParticipantsSql, new { ChatId = newChatId, req.User1, req.User2 });

            return newChatId.ToString();
        }

        public async Task<MessageDto> SendMessage(SendMessageRequest req)
        {
            string insertQuery = @"
            INSERT INTO Messages (MessageId, ChatId, SenderId, MessageText, MessageType, CreatedAt)
            VALUES (@MessageId, @ChatId, @SenderId, @MessageText, @MessageType, GETDATE());

            SELECT MessageId, ChatId, SenderId, MessageText, MessageType, CreatedAt, IsDeleted, IsEdited
            FROM Messages
            WHERE MessageId = @MessageId;
        ";

            var newMessageId = Guid.NewGuid();
            var parameters = new
            {
                MessageId = newMessageId,
                req.ChatId,
                req.SenderId,
                req.MessageText,
                req.MessageType
            };

            var message = await connection.QueryFirstAsync<MessageDto>(insertQuery, parameters);
            return message;
        }
    }
}
