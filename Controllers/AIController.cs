using ArcheryWebsite.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace ArcheryWebsite.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AIController : ControllerBase
{
    private readonly ArcheryDataService _dataService;
    private readonly IConfiguration _configuration; // Added for secure key access
    private const string OpenAiUrl = "https://api.openai.com/v1/chat/completions";

    // Constructor now injects IConfiguration
    public AIController(ArcheryDataService dataService, IConfiguration configuration)
    {
        _dataService = dataService;
        _configuration = configuration;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        // 1. SECURELY GET THE API KEY
        string openAiKey = _configuration["OpenAI:Key"];

        if (string.IsNullOrEmpty(openAiKey))
        {
            return StatusCode(500, "Server Error: OpenAI API Key is missing from configuration.");
        }

        // 2. DEFINE THE AI PERSONA
        var systemPrompt = @"You are an expert Archery Coach AI. 
        Your goal is to analyze data and give specific, encouraging, and technical advice.
        - If the user provides score data, analyze the trend (is it going up or down?).
        - If the score is low, offer technical tips for consistency.
        - Keep answers concise (under 100 words) and friendly.";

        string finalUserPrompt = request.Message;

        // 3. INTELLIGENT CONTEXT INJECTION
        if (DetectsIntentToGetScores(request.Message))
        {
            var scores = await _dataService.GetRecentScoresAsync(request.ArcherId);
            var jsonScores = JsonSerializer.Serialize(scores);
            finalUserPrompt = $"{request.Message}\n\n[CONTEXT DATA FROM DATABASE]:\n{jsonScores}";
        }

        // 4. CALL THE REAL AI (Passing the key securely)
        var aiResponse = await CallOpenAiApi(openAiKey, systemPrompt, finalUserPrompt);

        return Ok(new { response = aiResponse });
    }

    // --- HELPER: CONNECT TO OPENAI ---
    // Now accepts apiKey as a parameter
    private async Task<string> CallOpenAiApi(string apiKey, string systemPrompt, string userMessage)
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

        var requestBody = new
        {
            model = "gpt-4o-mini", // Or "gpt-3.5-turbo"
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
                // Log this error server-side if possible
                return "Error: I cannot connect to the AI brain right now. (Check API Key or Quota)";
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

            // Check for OpenAI specific error messages inside the JSON
            if (doc.RootElement.TryGetProperty("error", out var errorElem))
            {
                return $"OpenAI Error: {errorElem.GetProperty("message").GetString()}";
            }

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
               message.Contains("bad") ||
               message.Contains("performance");
    }

    public class ChatRequest
    {
        public int ArcherId { get; set; }
        public string Message { get; set; }
    }
}