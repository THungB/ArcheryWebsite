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

    public async Task<object> GetRecentScoresAsync(int archerId, int limit = 5) {return null; }
    public async Task<object> GetPersonalBestsAsync(int archerId) {return null; }

    public async Task<object> GetFullContextAsync(int archerId)
    {
        var archerInfo = await _context.Archers
            .Where(a => a.ArcherId == archerId)
            .Select(a => new {
                Name = $"{a.FirstName} {a.LastName}",
                a.Gender,
                Equipment = _context.Equipment.FirstOrDefault(e => e.EquipmentId == a.DefaultEquipmentId).DivisionType
            })
            .FirstOrDefaultAsync();
        var scoreHistory = await _context.Scores
            .Where(s => s.ArcherId == archerId)
            .OrderByDescending(s => s.DateShot)
            .Take(10)
            .Select(s => new {
                s.DateShot,
                s.TotalScore,
                Round = s.Round.RoundName,
                Competition = s.Comp != null ? s.Comp.CompName : "Practice"
            })
            .ToListAsync();

        var personalBests = await _context.Scores
            .Where(s => s.ArcherId == archerId)
            .GroupBy(s => s.Round.RoundName)
            .Select(g => new {
                Round = g.Key,
                BestScore = g.Max(s => s.TotalScore)
            })
            .ToListAsync();
        var today = DateOnly.FromDateTime(DateTime.Now);
        var upcomingComps = await _context.Competitions
            .Where(c => c.EndDate >= today)
            .OrderBy(c => c.StartDate)
            .Take(3)
            .Select(c => new {
                c.CompName,
                c.StartDate,
                c.Location,
                Details = c.Details
            })
            .ToListAsync();

        var roundDefinitions = await _context.Rounds
            .Select(r => new {
                r.RoundName,
                r.Description,
                r.RoundFamilyCode
            })
            .ToListAsync();

        return new
        {
            ArcherProfile = archerInfo,
            History = scoreHistory,
            PersonalBests = personalBests,
            UpcomingCompetitions = upcomingComps,
            RoundDefinitions = roundDefinitions,
            SystemDate = DateTime.Now.ToString("yyyy-MM-dd") 
        };
    }
}