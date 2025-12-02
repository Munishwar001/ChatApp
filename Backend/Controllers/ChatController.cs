using App.Application.Interfaces;
using App.core.DTOs.Chat;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using OpenAI.Chat;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly IChatRepository _chatRepository;
        public ChatController(IHttpClientFactory httpClientFactory, IConfiguration config, IChatRepository chatRepository)
        {
            _httpClient = httpClientFactory.CreateClient();
            _config = config;
            _chatRepository = chatRepository;
        }

        [HttpGet("messages/{chatId}")]
        public async Task<IActionResult> GetMessages(Guid chatId)
        {
            var messages = await _chatRepository.getMessage(chatId);
            return Ok(messages);
        }

        //[HttpPost("send")]
        //    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        //    {
        //        using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        //        string insertQuery = @"
        //    INSERT INTO Messages (MessageId, ChatId, SenderId, MessageText, MessageType, CreatedAt)
        //    VALUES (@MessageId, @ChatId, @SenderId, @MessageText, @MessageType, GETDATE());

        //    SELECT MessageId, ChatId, SenderId, MessageText, MessageType, CreatedAt, IsDeleted, IsEdited
        //    FROM Messages
        //    WHERE MessageId = @MessageId;
        //";

        //        var newMessageId = Guid.NewGuid();

        //        var parameters = new
        //        {
        //            MessageId = newMessageId,
        //            request.ChatId,
        //            request.SenderId,
        //            request.MessageText,
        //            request.MessageType
        //        };

        //        var message = await conn.QueryFirstAsync<MessageDto>(insertQuery, parameters);

        //        return Ok(message);
        //    }
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            var message = await _chatRepository.SendMessage(request);
            return Ok(message);
        }

        [HttpPost("create-or-get")]
        public async Task<IActionResult> CreateOrGetChat([FromBody] CreateChatRequest req)
        {
            var newChatId = await _chatRepository.createOrGetChat(req);
           
            return Ok(new { chatId = newChatId });
        }

        [HttpPost("ask")]
        public async Task<ActionResult<string>> Ask([FromBody] ChatRequest request)
        {

            // Set Groq API Key
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _config["Groq:ApiKey"]);

            // Prepare Groq request payload (OpenAI format)
            var payload = new
            {
                model = _config["Groq:Model"],

                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content = "You are a friendly, empathetic AI assistant. Express emotions naturally in your responses, show understanding, and be warm and conversational like a human friend would be."
                    },
                    new
                    {
                        role = "user",
                        content = request.Message
                    }
                },
                temperature = 0.9,  // Higher = more creative and emotional
                max_completion_tokens = 1024,
                top_p = 1,
                stream = false
            };

            string json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Groq API URL
            var response = await _httpClient.PostAsync(
                "https://api.groq.com/openai/v1/chat/completions",
                content
            );

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest($"Groq API error: {error}");
            }

            var resultJson = await response.Content.ReadAsStringAsync();
            var resultDoc = JsonDocument.Parse(resultJson);

            string reply =
                resultDoc.RootElement
                         .GetProperty("choices")[0]
                         .GetProperty("message")
                         .GetProperty("content")
                         .GetString();

            return Ok(reply);
        }
        public class ChatRequest
        {
            public string Message { get; set; } = string.Empty;
        }
    }
}