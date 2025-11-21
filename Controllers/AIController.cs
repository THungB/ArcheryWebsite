using ArcheryWebsite.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ArcheryWebsite.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AIController : ControllerBase
{
    private readonly ArcheryDataService _dataService;

    private const string OpenAiKey = "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";
    private const string OpenAiUrl = "https://api.openai.com/v1/chat/completions";

    public AIController(ArcheryDataService dataService)
    {
        _dataService = dataService;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        // 1. DEFINE THE AI PERSONA
        var systemPrompt = @"You are an expert Archery Coach AI. 
        Your goal is to analyze data and give specific, encouraging, and technical advice.
        - If the user provides score data, analyze the trend (is it going up or down?).
        - If the score is low, offer technical tips for consistency.
        - Keep answers concise (under 100 words) and friendly.";

        string finalUserPrompt = request.Message;

        // 2. INTELLIGENT CONTEXT INJECTION
        // If the user is asking about performance, we fetch data from the DB
        // and "feed" it to the AI silently. The user doesn't see this, but the AI does.
        if (DetectsIntentToGetScores(request.Message))
        {
            var scores = await _dataService.GetRecentScoresAsync(request.ArcherId);
            var jsonScores = JsonSerializer.Serialize(scores);

            // We append the data to the user's message so the AI knows the context
            finalUserPrompt = $"{request.Message}\n\n[CONTEXT DATA FROM DATABASE]:\n{jsonScores}";
        }

        // 3. CALL THE REAL AI
        var aiResponse = await CallOpenAiApi(systemPrompt, finalUserPrompt);

        return Ok(new { response = aiResponse });
    }

    // --- HELPER: CONNECT TO OPENAI ---
    private async Task<string> CallOpenAiApi(string systemPrompt, string userMessage)
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {OpenAiKey}");

        var requestBody = new
        {
            model = "gpt-4o-mini", // Or "gpt-3.5-turbo" (cheaper)
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userMessage }
            },
            temperature = 0.7
        };

        var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        try
        {
            var response = await client.PostAsync(OpenAiUrl, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                return "Error: I cannot connect to the AI brain right now. (Check API Key)";
            }

            var responseString = await response.Content.ReadAsStringAsync();

            // Parse the complex JSON response from OpenAI to get just the text
            using var doc = JsonDocument.Parse(responseString);
            var content = doc.RootElement
                             .GetProperty("choices")[0]
                             .GetProperty("message")
                             .GetProperty("content")
                             .GetString();

            return content ?? "No response generated.";
        }
        catch (Exception ex)
        {
            return $"System Error: {ex.Message}";
        }
    }

    // --- HELPER: DETECT INTENT ---
    private bool DetectsIntentToGetScores(string message)
    {
        if (string.IsNullOrWhiteSpace(message)) return false;
        message = message.ToLower();
        return message.Contains("score") ||
               message.Contains("history") ||
               message.Contains("bad") || // "Why am I shooting bad?"
               message.Contains("performance");
    }

    public class ChatRequest
    {
        public int ArcherId { get; set; }
        public string Message { get; set; }
    }
}