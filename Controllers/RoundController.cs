using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;

namespace ArcheryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoundController : ControllerBase
    {
        private readonly ArcheryDbContext _context;

        public RoundController(ArcheryDbContext context)
        {
            _context = context;
        }

        // GET: api/Round
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Round>>> GetRounds([FromQuery] bool includeHistory = false)
        {
            try
            {
                var query = _context.Rounds.AsQueryable();

                if (!includeHistory)
                {
                    query = query.Where(r => r.ValidTo == null);
                }

                var rounds = await query.ToListAsync();
                return Ok(rounds);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving rounds", error = ex.Message });
            }
        }

        // GET: api/Round/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Round>> GetRound(int id)
        {
            try
            {
                var round = await _context.Rounds.FindAsync(id);

                if (round == null)
                {
                    return NotFound(new { message = $"Round with ID {id} not found" });
                }

                return Ok(round);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving round", error = ex.Message });
            }
        }

        // GET: api/Round/5/ranges
        [HttpGet("{id}/ranges")]
        public async Task<ActionResult> GetRoundRanges(int id)
        {
            try
            {
                var round = await _context.Rounds.FindAsync(id);
                if (round == null)
                {
                    return NotFound(new { message = $"Round with ID {id} not found" });
                }

                var roundRanges = await _context.Roundranges
                    .Where(rr => rr.RoundId == id)
                    .Include(rr => rr.Range)
                    .OrderBy(rr => rr.SequenceNumber)
                    .Select(rr => new
                    {
                        sequenceNumber = rr.SequenceNumber,
                        rangeId = rr.RangeId,
                        distanceMeters = rr.Range.DistanceMeters,
                        endCount = rr.Range.EndCount
                    })
                    .ToListAsync();

                return Ok(new
                {
                    roundId = round.RoundId,
                    roundName = round.RoundName,
                    description = round.Description,
                    ranges = roundRanges
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving round ranges", error = ex.Message });
            }
        }

        // POST: api/Round
        [HttpPost]
        public async Task<ActionResult<Round>> CreateRound(Round round)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(round.RoundName))
                {
                    return BadRequest(new { message = "Round name is required" });
                }

                _context.Rounds.Add(round);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetRound),
                    new { id = round.RoundId },
                    round
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating round", error = ex.Message });
            }
        }

        // PUT: api/Round/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRound(int id, Round round)
        {
            if (id != round.RoundId)
            {
                return BadRequest(new { message = "Round ID mismatch" });
            }

            try
            {
                var existingRound = await _context.Rounds.FindAsync(id);
                if (existingRound == null)
                {
                    return NotFound(new { message = $"Round with ID {id} not found" });
                }

                existingRound.RoundName = round.RoundName;
                existingRound.Description = round.Description;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Round updated successfully", round = existingRound });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoundExists(id))
                {
                    return NotFound(new { message = $"Round with ID {id} not found" });
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating round", error = ex.Message });
            }
        }

        // DELETE: api/Round/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRound(int id)
        {
            try
            {
                var round = await _context.Rounds.FindAsync(id);
                if (round == null)
                {
                    return NotFound(new { message = $"Round with ID {id} not found" });
                }

                _context.Rounds.Remove(round);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Round deleted successfully", roundId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting round", error = ex.Message });
            }
        }

        // GET: api/Round/search?name=WA
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Round>>> SearchRounds([FromQuery] string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name))
                {
                    return BadRequest(new { message = "Search term is required" });
                }

                var rounds = await _context.Rounds
                    .Where(r => r.RoundName.Contains(name))
                    .ToListAsync();

                return Ok(rounds);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error searching rounds", error = ex.Message });
            }
        }

        private bool RoundExists(int id)
        {
            return _context.Rounds.Any(e => e.RoundId == id);
        }
    }
}