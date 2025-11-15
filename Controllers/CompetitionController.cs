using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;

namespace ArcheryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompetitionController : ControllerBase
    {
        private readonly ArcheryDbContext _context;

        public CompetitionController(ArcheryDbContext context)
        {
            _context = context;
        }

        // GET: api/Competition
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Competition>>> GetCompetitions()
        {
            try
            {
                var competitions = await _context.Competitions
                    .OrderByDescending(c => c.StartDate)
                    .ToListAsync();
                return Ok(competitions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving competitions", error = ex.Message });
            }
        }

        // GET: api/Competition/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Competition>> GetCompetition(int id)
        {
            try
            {
                var competition = await _context.Competitions.FindAsync(id);

                if (competition == null)
                {
                    return NotFound(new { message = $"Competition with ID {id} not found" });
                }

                return Ok(competition);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving competition", error = ex.Message });
            }
        }

        // POST: api/Competition
        [HttpPost]
        public async Task<ActionResult<Competition>> CreateCompetition(Competition competition)
        {
            try
            {
                // Validation
                if (string.IsNullOrWhiteSpace(competition.CompName))
                {
                    return BadRequest(new { message = "Competition name is required" });
                }

                if (competition.EndDate < competition.StartDate)
                {
                    return BadRequest(new { message = "End date cannot be before start date" });
                }

                _context.Competitions.Add(competition);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetCompetition),
                    new { id = competition.CompId },
                    competition
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating competition", error = ex.Message });
            }
        }

        // PUT: api/Competition/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompetition(int id, Competition competition)
        {
            if (id != competition.CompId)
            {
                return BadRequest(new { message = "Competition ID mismatch" });
            }

            try
            {
                var existingCompetition = await _context.Competitions.FindAsync(id);
                if (existingCompetition == null)
                {
                    return NotFound(new { message = $"Competition with ID {id} not found" });
                }

                // Update properties
                existingCompetition.CompName = competition.CompName;
                existingCompetition.StartDate = competition.StartDate;
                existingCompetition.EndDate = competition.EndDate;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Competition updated successfully", competition = existingCompetition });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompetitionExists(id))
                {
                    return NotFound(new { message = $"Competition with ID {id} not found" });
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating competition", error = ex.Message });
            }
        }

        // DELETE: api/Competition/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompetition(int id)
        {
            try
            {
                var competition = await _context.Competitions.FindAsync(id);
                if (competition == null)
                {
                    return NotFound(new { message = $"Competition with ID {id} not found" });
                }

                _context.Competitions.Remove(competition);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Competition deleted successfully", competitionId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting competition", error = ex.Message });
            }
        }

        // GET: api/Competition/5/scores
        [HttpGet("{id}/scores")]
        public async Task<ActionResult<IEnumerable<Score>>> GetCompetitionScores(int id)
        {
            try
            {
                var competition = await _context.Competitions.FindAsync(id);
                if (competition == null)
                {
                    return NotFound(new { message = $"Competition with ID {id} not found" });
                }

                var scores = await _context.Scores
                    .Where(s => s.CompId == id)
                    .Include(s => s.Archer)
                    .Include(s => s.Round)
                    .OrderByDescending(s => s.TotalScore)
                    .ToListAsync();

                return Ok(scores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving competition scores", error = ex.Message });
            }
        }

        // GET: api/Competition/5/leaderboard
        [HttpGet("{id}/leaderboard")]
        public async Task<ActionResult> GetCompetitionLeaderboard(int id)
        {
            try
            {
                var competition = await _context.Competitions.FindAsync(id);
                if (competition == null)
                {
                    return NotFound(new { message = $"Competition with ID {id} not found" });
                }

                var leaderboard = await _context.Scores
                    .Where(s => s.CompId == id)
                    .Include(s => s.Archer)
                    .Include(s => s.Round)
                    .OrderByDescending(s => s.TotalScore)
                    .Select(s => new
                    {
                        archerId = s.ArcherId,
                        archerName = s.Archer.FirstName + " " + s.Archer.LastName,
                        roundName = s.Round.RoundName,
                        totalScore = s.TotalScore,
                        dateShot = s.DateShot
                    })
                    .ToListAsync();

                // Add rank
                var rankedLeaderboard = leaderboard
                    .Select((item, index) => new
                    {
                        rank = index + 1,
                        item.archerId,
                        item.archerName,
                        item.roundName,
                        item.totalScore,
                        item.dateShot
                    });

                return Ok(rankedLeaderboard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving leaderboard", error = ex.Message });
            }
        }

        // GET: api/Competition/upcoming
        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<Competition>>> GetUpcomingCompetitions()
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.Today);
                var competitions = await _context.Competitions
                    .Where(c => c.StartDate >= today)
                    .OrderBy(c => c.StartDate)
                    .ToListAsync();

                return Ok(competitions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving upcoming competitions", error = ex.Message });
            }
        }

        // GET: api/Competition/past
        [HttpGet("past")]
        public async Task<ActionResult<IEnumerable<Competition>>> GetPastCompetitions()
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.Today);
                var competitions = await _context.Competitions
                    .Where(c => c.EndDate < today)
                    .OrderByDescending(c => c.EndDate)
                    .ToListAsync();

                return Ok(competitions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving past competitions", error = ex.Message });
            }
        }

        private bool CompetitionExists(int id)
        {
            return _context.Competitions.Any(e => e.CompId == id);
        }
    }
}