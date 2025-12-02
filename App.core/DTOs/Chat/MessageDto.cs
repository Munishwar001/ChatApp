namespace App.core.DTOs.Chat
{
    public class MessageDto
    {
        public Guid MessageId { get; set; }
        public Guid ChatId { get; set; }
        public string? SenderId { get; set; }
        public string? MessageText { get; set; }  
        public string? MessageType { get; set; }   
        public DateTime CreatedAt { get; set; }  
        public bool IsDeleted { get; set; }
        public bool IsEdited { get; set; }
    }

    public class SendMessageRequest
    {
        public Guid ChatId { get; set; }
        public string SenderId { get; set; } = null!;
        public string MessageText { get; set; } = null!;
        public string MessageType { get; set; } = "text";  
    }

    public class CreateChatRequest
    {
        public string User1 { get; set; } = null!;  
        public string User2 { get; set; } = null!;  
    }
}
