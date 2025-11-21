using ArcheryWebsite.Models;
using Microsoft.EntityFrameworkCore;
namespace ArcheryWebsite.Services;
public class ArcheryDataService
{
    private readonly ArcheryDbContext _context;

    public ArcheryDataService(ArcheryDbContext context)
    {
        _context = context;
    }

    // Tool 1: Get recent score history for the AI to analyse
    // Description for AI: "Get recent scores for an archer to analyse performance trend."
    public async Task<object> GetRecentScoresAsync(int archerId, int limit = 5)
    {
        var scores = await _context.Scores
            .Where(s => s.ArcherId == archerId)
            .OrderByDescending(s => s.DateShot)
            .Take(limit)
            .Select(s => new
            {
                s.DateShot,
                s.TotalScore,
                RoundName = s.Round.RoundName,
                Competition = s.Comp != null ? s.Comp.CompName : "Practice"
            })
            .ToListAsync();

        if (!scores.Any())
            return "No scores found for this archer.";

        return scores;
    }

    // Tool 2: Get Personal Best (PB) scores for an archer
    // Description for AI: "Get personal best scores for an archer"

    public async Task<object> GetPersonalBestsAsync(int archerId)
    {
        var pbs = await _context.Scores
            .Where(s => s.ArcherId == archerId)
            .GroupBy(s => s.Round.RoundName)
            .Select(g => new
            {
                Round = g.Key,
                BestScore = g.Max(s => s.TotalScore)
            })
            .ToListAsync();

        return pbs;
    }
}
