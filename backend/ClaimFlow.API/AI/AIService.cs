using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace ClaimFlow.API.AI
{
    public class AIService :IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public AIService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }
        public async Task<string> SummarizeClaimAsync(string claimContext)
        {
            var apiKey = _configuration["AISettings:APIKey"];

            var requestBody = new
            {
                model = "openrouter/free",
                messages = new object[]
                {
                    new
                    {
                        role = "system",
                        content = "You are a helpful assistant for insurance claims processing."
                    },
                    new
                    {
                        role = "user", 
                        content = $@"
                        Analyze the following claim details, notes, and errors.
                        Provide a short professional summary including:
                        - current status
                        - key issues
                        - next steps

                        Claim Data:
                        {claimContext}
                        " 
                    }
                }
             };

            var requestJson = JsonSerializer.Serialize(requestBody);

            var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey); 
            request.Headers.Add("HTTP-Referer", "http://localhost:5173");
            request.Headers.Add("X-Title", "ClaimFlow AI");

            request.Content = new StringContent(requestJson, Encoding.UTF8, "application/json");

            using var response = await _httpClient.SendAsync(request);
            var responseJson = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return $"AI summary failed. Status: {(int)response.StatusCode}. OpenAI response: {responseJson}";
            }

            using var doc = JsonDocument.Parse(responseJson);

            var summary = doc
                .RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return summary ?? "No summary generated.";
        }
    }
}
