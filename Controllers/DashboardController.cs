using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;

namespace ArcheryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ArcheryDbContext _context;

        public DashboardController(ArcheryDbContext context)
        {
            _context = context;
        }

        // GET: api/Dashboard/stats
        [HttpGet("stats")]
        public async Task<ActionResult> GetSystemStats()
        {
            var stats = new
            {
                totalUsers = await _context.Archers.CountAsync(),
                activeCompetitions = await _context.Competitions.CountAsync(c => c.EndDate >= DateOnly.FromDateTime(DateTime.Now)),
                totalScores = await _context.Scores.CountAsync(),
                pendingApprovals = await _context.Stagingscores.CountAsync(s => s.Status == "pending"),
                totalCompetitions = await _context.Competitions.CountAsync()
            };
            return Ok(stats);
        }

        // GET: api/Dashboard/logs
        [HttpGet("logs")]
        public async Task<ActionResult> GetLogs()
        {
            var logs = await _context.SystemLogs
                .OrderByDescending(l => l.Timestamp)
                .Take(50)
                .ToListAsync();
            return Ok(logs);
        }
    }
}