using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;

namespace ArcheryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScoreController : ControllerBase
    {
        private readonly ArcheryDbContext _context;

        public ScoreController(ArcheryDbContext context)
        {
            _context = context;
        }

        // GET: api/Score
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Score>>> GetScores()
        {
            try
            {
                var scores = await _context.Scores
                    .Include(s => s.Archer)
                    .Include(s => s.Round)
                    .Include(s => s.Comp)
                    .OrderByDescending(s => s.DateShot)
                    .ToListAsync();

                return Ok(scores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving scores", error = ex.Message });
            }
        }

        // GET: api/Score/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetScore(int id)
        {
            try
            {
                var score = await _context.Scores
                    .Include(s => s.Archer)
                    .Include(s => s.Round)
                    .Include(s => s.Comp)
                    .FirstOrDefaultAsync(s => s.ScoreId == id);

                if (score == null)
                {
                    return NotFound(new { message = $"Score with ID {id} not found" });
                }

                // Get ends for this score
                var ends = await _context.Ends
                    .Where(e => e.ScoreId == id)
                    .Include(e => e.Range)
                    .OrderBy(e => e.EndNumber)
                    .ToListAsync();

                // Get arrows for each end
                var scoreDetails = new
                {
                    score,
                    ends = await Task.WhenAll(ends.Select(async end => new
                    {
                        endId = end.EndId,
                        endNumber = end.EndNumber,
                        endScore = end.EndScore,
                        rangeDistance = end.Range.DistanceMeters,
                        arrows = await _context.Arrows
                            .Where(a => a.EndId == end.EndId)
                            .OrderByDescending(a => a.ArrowValue)
                            .Select(a => a.ArrowValue)
                            .ToListAsync()
                    }))
                };

                return Ok(scoreDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving score details", error = ex.Message });
            }
        }

        // POST: api/Score
        [HttpPost]
        public async Task<ActionResult<Score>> CreateScore(Score score)
        {
            try
            {
                if (score.TotalScore < 0)
                {
                    return BadRequest(new { message = "Total score cannot be negative" });
                }

                _context.Scores.Add(score);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetScore),
                    new { id = score.ScoreId },
                    score
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating score", error = ex.Message });
            }
        }

        // PUT: api/Score/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateScore(int id, Score score)
        {
            if (id != score.ScoreId)
            {
                return BadRequest(new { message = "Score ID mismatch" });
            }

            try
            {
                var existingScore = await _context.Scores.FindAsync(id);
                if (existingScore == null)
                {
                    return NotFound(new { message = $"Score with ID {id} not found" });
                }

                existingScore.TotalScore = score.TotalScore;
                existingScore.DateShot = score.DateShot;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Score updated successfully", score = existingScore });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating score", error = ex.Message });
            }
        }

        // DELETE: api/Score/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScore(int id)
        {
            try
            {
                var score = await _context.Scores.FindAsync(id);
                if (score == null)
                {
                    return NotFound(new { message = $"Score with ID {id} not found" });
                }

                _context.Scores.Remove(score);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Score deleted successfully", scoreId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting score", error = ex.Message });
            }
        }

        // GET: api/Score/personal-bests/1
        [HttpGet("personal-bests/{archerId}")]
        public async Task<ActionResult> GetPersonalBests(int archerId)
        {
            try
            {
                var personalBests = await _context.Scores
                    .Where(s => s.ArcherId == archerId)
                    .Include(s => s.Round)
                    .GroupBy(s => s.RoundId)
                    .Select(g => new
                    {
                        roundId = g.Key,
                        roundName = g.First().Round.RoundName,
                        bestScore = g.Max(s => s.TotalScore),
                        dateAchieved = g.OrderByDescending(s => s.TotalScore).First().DateShot,
                        competitionId = g.OrderByDescending(s => s.TotalScore).First().CompId
                    })
                    .ToListAsync();

                return Ok(personalBests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving personal bests", error = ex.Message });
            }
        }

        // GET: api/Score/club-records
        [HttpGet("club-records")]
        public async Task<ActionResult> GetClubRecords()
        {
            try
            {
                var clubRecords = await _context.Scores
                    .Include(s => s.Archer)
                    .Include(s => s.Round)
                    .GroupBy(s => s.RoundId)
                    .Select(g => new
                    {
                        roundId = g.Key,
                        roundName = g.First().Round.RoundName,
                        recordScore = g.Max(s => s.TotalScore),
                        recordHolder = g.OrderByDescending(s => s.TotalScore).First().Archer.FirstName + " " + 
                                      g.OrderByDescending(s => s.TotalScore).First().Archer.LastName,
                        dateAchieved = g.OrderByDescending(s => s.TotalScore).First().DateShot
                    })
                    .ToListAsync();

                return Ok(clubRecords);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving club records", error = ex.Message });
            }
        }
    }
}
