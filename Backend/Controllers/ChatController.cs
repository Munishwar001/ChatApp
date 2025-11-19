using Microsoft.AspNetCore.Mvc;
using OpenAI.Chat;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public ChatController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet]
        public IActionResult Index()
        {
            return Content("Chat Controller is listening");
        }


        [HttpPost("ask")]
        public async Task<ActionResult<string>> Ask([FromBody] ChatRequest request)
        {
            // Set your Hugging Face API token
            string apiKey = "YOUR_HUGGINGFACE_API_KEY";
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            // Prepare payload
            var payload = new
            {
                inputs = request.Message,
                parameters = new
                {
                    max_new_tokens = 150
                }
            };

            // Replace with the model you copied
            var modelName = "YOUR_MODEL_NAME";

            var response = await _httpClient.PostAsJsonAsync(
                $"https://api-inference.huggingface.co/models/{modelName}",
                payload
            );

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest($"Hugging Face API error: {error}");
            }

            var result = await response.Content.ReadFromJsonAsync<List<Dictionary<string, object>>>();
            if (result == null || result.Count == 0) return Ok("No response from model");

            string generatedText = result[0]["generated_text"].ToString();
            return Ok(generatedText);
        }
    }


    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
    }
}