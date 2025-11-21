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
    private readonly IConfiguration _configuration;

    public AIController(ArcheryDataService dataService, IConfiguration configuration)
    {
        _dataService = dataService;
        _configuration = configuration;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        // 1. GET THE GEMINI KEY
        string geminiKey = _configuration["GoogleAI:Key"];
        if (string.IsNullOrEmpty(geminiKey))
        {
            return StatusCode(500, "Server Error: Google AI Key is missing.");
        }

        // 2. PREPARE THE PROMPT
        var systemInstruction = @"You are an expert Archery Coach AI. 
        Your goal is to analyze data and give specific, encouraging, and technical advice.
        - If the user provides score data, analyze the trend (is it going up or down?).
        - Keep answers concise (under 100 words) and friendly.";

        string finalUserPrompt = request.Message;

        // 3. CONTEXT INJECTION (Same as before)
        if (DetectsIntentToGetScores(request.Message))
        {
            var scores = await _dataService.GetRecentScoresAsync(request.ArcherId);
            var jsonScores = JsonSerializer.Serialize(scores);
            finalUserPrompt = $"{request.Message}\n\n[CONTEXT DATA FROM DATABASE]:\n{jsonScores}";
        }

        // Combine system instruction and user prompt for Gemini
        // (Gemini REST API handles system instructions differently, but simply prepending it works well for simple cases)
        string combinedPrompt = $"{systemInstruction}\n\nUser Request: {finalUserPrompt}";

        // 4. CALL GEMINI
        var aiResponse = await CallGeminiApi(geminiKey, combinedPrompt);

        return Ok(new { response = aiResponse });
    }

    private async Task<string> CallGeminiApi(string apiKey, string prompt)
    {
        // 1. UPDATED URL: Using 'gemini-2.5-flash' which was confirmed in your list
        string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

        using var client = new HttpClient();

        // 2. Gemini JSON Structure
        var requestBody = new
        {
            contents = new[]
            {
                new {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        try
        {
            var response = await client.PostAsync(url, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                // If this fails, it will tell us exactly why (e.g., 400 Bad Request)
                return $"Error: Google returned {response.StatusCode}.";
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

            // 3. Parse the Response
            // Structure: candidates[0] -> content -> parts[0] -> text
            if (doc.RootElement.TryGetProperty("candidates", out var candidates))
            {
                var text = candidates[0]
                            .GetProperty("content")
                            .GetProperty("parts")[0]
                            .GetProperty("text")
                            .GetString();

                return text ?? "No response generated.";
            }

            return "Error parsing Gemini response.";
        }
        catch (Exception ex)
        {
            return $"System Error: {ex.Message}";
        }
    }

    private bool DetectsIntentToGetScores(string message)
    {
        if (string.IsNullOrWhiteSpace(message)) return false;
        message = message.ToLower();
        return message.Contains("score") || message.Contains("history") || message.Contains("performance");
    }

    public class ChatRequest
    {
        public int ArcherId { get; set; }
        public string Message { get; set; }
    }
}