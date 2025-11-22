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
    private readonly IConfiguration _configuration;

    public AIController(ArcheryDataService dataService, IConfiguration configuration)
    {
        _dataService = dataService;
        _configuration = configuration;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        string geminiKey = _configuration["GoogleAI:Key"];
        if (string.IsNullOrEmpty(geminiKey))
        {
            return StatusCode(500, "Server Error: Google AI Key is missing.");
        }

        try
        {
            var fullContextData = await _dataService.GetFullContextAsync(request.ArcherId);

            var jsonOptions = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.IgnoreCycles,
                WriteIndented = false
            };
            string jsonContext = JsonSerializer.Serialize(fullContextData, jsonOptions);

            var systemInstruction = $@"
            You are an expert Archery Coach AI assistant for an application named 'ArcheryTrack'.
            
            I will provide you with a JSON object containing the DATABASE CONTEXT regarding the user (Archer).
            The JSON includes:
            - 'ArcherProfile': User's name and equipment.
            - 'History': Recent score logs.
            - 'PersonalBests': Their best scores per round.
            - 'UpcomingCompetitions': Competitions happening soon.
            - 'RoundDefinitions': Rules/info about specific archery rounds.
            - 'SystemDate': Today's date.

            YOUR TASK:
            1. Analyze the user's question.
            2. Look up relevant information in the provided JSON Context.
            3. Answer the user helpfuly.
            - If they ask about their performance, calculate trends from 'History'.
            - If they ask about competitions, check 'UpcomingCompetitions'.
            - If the answer is not in the data, say you don't have that info recorded.
            - Keep the tone encouraging, professional, and concise (under 150 words unless detailed analysis is asked).

            [DATABASE CONTEXT]:
            {jsonContext}
            ";

            string finalPrompt = $"{systemInstruction}\n\nUser Question: {request.Message}";

            var aiResponse = await CallGeminiApi(geminiKey, finalPrompt);

            return Ok(new { response = aiResponse });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    private async Task<string> CallGeminiApi(string apiKey, string prompt)
    {
        string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

        using var client = new HttpClient();

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
                var errorMsg = await response.Content.ReadAsStringAsync();
                return $"Error from Google AI: {response.StatusCode} - {errorMsg}";
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

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

    public class ChatRequest
    {
        public int ArcherId { get; set; }
        public string Message { get; set; }
    }
}