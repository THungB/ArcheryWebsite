using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;

namespace ArcheryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StagingScoreController : ControllerBase
    {
        private readonly ArcheryDbContext _context;

        public StagingScoreController(ArcheryDbContext context)
        {
            _context = context;
        }

        // GET: api/StagingScore
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Stagingscore>>> GetStagingScores()
        {
            try
            {
                var stagingScores = await _context.Stagingscores
                    .Include(ss => ss.Archer)
                    .Include(ss => ss.Round)
                    .Include(ss => ss.Equipment)
                    .OrderByDescending(ss => ss.DateTime)
                    .ToListAsync();

                return Ok(stagingScores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving staging scores", error = ex.Message });
            }
        }

        // GET: api/StagingScore/pending
        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<Stagingscore>>> GetPendingScores()
        {
            try
            {
                var pendingScores = await _context.Stagingscores
                    .Where(ss => ss.Status == "pending")
                    .Include(ss => ss.Archer)
                    .Include(ss => ss.Round)
                    .Include(ss => ss.Equipment)
                    .OrderBy(ss => ss.DateTime)
                    .ToListAsync();

                return Ok(pendingScores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving pending scores", error = ex.Message });
            }
        }

        // GET: api/StagingScore/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Stagingscore>> GetStagingScore(int id)
        {
            try
            {
                var stagingScore = await _context.Stagingscores
                    .Include(ss => ss.Archer)
                    .Include(ss => ss.Round)
                    .Include(ss => ss.Equipment)
                    .FirstOrDefaultAsync(ss => ss.StagingId == id);

                if (stagingScore == null)
                {
                    return NotFound(new { message = $"Staging score with ID {id} not found" });
                }

                return Ok(stagingScore);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving staging score", error = ex.Message });
            }
        }

        // POST: api/StagingScore
        [HttpPost]
        public async Task<ActionResult<Stagingscore>> CreateStagingScore(Stagingscore stagingScore)
        {
            try
            {
                // Set default status to pending
                stagingScore.Status = "pending";
                stagingScore.DateTime = DateTime.Now;

                _context.Stagingscores.Add(stagingScore);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetStagingScore),
                    new { id = stagingScore.StagingId },
                    stagingScore
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating staging score", error = ex.Message });
            }
        }

        // PUT: api/StagingScore/5/approve
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveScore(int id, [FromQuery] int? competitionId)
        {
            try
            {
                var stagingScore = await _context.Stagingscores.FindAsync(id);
                if (stagingScore == null)
                {
                    return NotFound(new { message = $"Staging score with ID {id} not found" });
                }

                if (stagingScore.Status == "approved")
                {
                    return BadRequest(new { message = "Score already approved" });
                }

                // Create official score
                var score = new Score
                {
                    ArcherId = stagingScore.ArcherId,
                    RoundId = stagingScore.RoundId,
                    CompId = competitionId,
                    DateShot = DateOnly.FromDateTime(stagingScore.DateTime),
                    TotalScore = stagingScore.RawScore
                };

                _context.Scores.Add(score);

                // Update staging score status
                stagingScore.Status = "approved";

                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Score approved successfully", 
                    scoreId = score.ScoreId,
                    stagingScoreId = stagingScore.StagingId 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error approving score", error = ex.Message });
            }
        }

        // PUT: api/StagingScore/5/reject
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectScore(int id, [FromBody] string reason)
        {
            try
            {
                var stagingScore = await _context.Stagingscores.FindAsync(id);
                if (stagingScore == null)
                {
                    return NotFound(new { message = $"Staging score with ID {id} not found" });
                }

                stagingScore.Status = "rejected";
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Score rejected", 
                    stagingScoreId = stagingScore.StagingId,
                    reason 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error rejecting score", error = ex.Message });
            }
        }

        // DELETE: api/StagingScore/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStagingScore(int id)
        {
            try
            {
                var stagingScore = await _context.Stagingscores.FindAsync(id);
                if (stagingScore == null)
                {
                    return NotFound(new { message = $"Staging score with ID {id} not found" });
                }

                _context.Stagingscores.Remove(stagingScore);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Staging score deleted successfully", stagingScoreId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting staging score", error = ex.Message });
            }
        }
    }
}
