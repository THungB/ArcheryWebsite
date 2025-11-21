using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;
using System.Text.Json;

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
                Console.WriteLine($"Error retrieving competitions: {ex.Message}");
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
                Console.WriteLine($"Error retrieving competition {id}: {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving competition", error = ex.Message });
            }
        }

        // POST: api/Competition
        [HttpPost]
        public async Task<ActionResult<Competition>> CreateCompetition(Competition competition)
        {
            try
            {
                if (competition == null)
                    return BadRequest(new { message = "Competition payload is required" });

                if (string.IsNullOrWhiteSpace(competition.CompName))
                    return BadRequest(new { message = "Competition name is required" });

                if (competition.EndDate < competition.StartDate)
                    return BadRequest(new { message = "End date cannot be before start date" });

                // Ensure Details is valid JSON; default to empty object if not provided.
                if (string.IsNullOrWhiteSpace(competition.Details))
                {
                    competition.Details = "{}";
                }
                else
                {
                    try
                    {
                        using var doc = JsonDocument.Parse(competition.Details);
                        // Normalize/serialize to a compact JSON string before saving
                        competition.Details = JsonSerializer.Serialize(doc.RootElement);
                    }
                    catch (JsonException jex)
                    {
                        Console.WriteLine($"Invalid JSON in Details: {jex.Message}");
                        return BadRequest(new { message = "Invalid JSON in Details field", error = jex.Message });
                    }
                }

                _context.Competitions.Add(competition);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCompetition), new { id = competition.CompId }, competition);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating competition: {ex.Message}");
                if (ex.InnerException != null) Console.WriteLine($"Inner: {ex.InnerException.Message}");
                return StatusCode(500, new { message = "Error creating competition", error = ex.Message });
            }
        }

        // PUT: api/Competition/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompetition(int id, Competition competition)
        {
            if (competition == null || id != competition.CompId)
                return BadRequest(new { message = "Competition payload is required and ID must match" });

            try
            {
                var existing = await _context.Competitions.FindAsync(id);
                if (existing == null) return NotFound(new { message = $"Competition with ID {id} not found" });

                existing.CompName = competition.CompName;
                existing.StartDate = competition.StartDate;
                existing.EndDate = competition.EndDate;
                existing.Location = competition.Location;
                existing.IsClubChampionship = competition.IsClubChampionship;

                // Validate and normalize Details JSON if provided; allow empty string / null -> store "{}"
                if (string.IsNullOrWhiteSpace(competition.Details))
                {
                    existing.Details = "{}";
                }
                else
                {
                    try
                    {
                        using var doc = JsonDocument.Parse(competition.Details);
                        existing.Details = JsonSerializer.Serialize(doc.RootElement);
                    }
                    catch (JsonException jex)
                    {
                        Console.WriteLine($"Invalid JSON in Details on update: {jex.Message}");
                        return BadRequest(new { message = "Invalid JSON in Details field", error = jex.Message });
                    }
                }

                _context.Entry(existing).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(existing);
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
                Console.WriteLine($"Error updating competition {id}: {ex.Message}");
                return StatusCode(500, new { message = "Error updating competition", error = ex.Message });
            }
        }

        // DELETE: api/Competition/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompetition(int id)
        {
            try
            {
                var comp = await _context.Competitions.FindAsync(id);
                if (comp == null) return NotFound(new { message = $"Competition with ID {id} not found" });

                _context.Competitions.Remove(comp);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Competition deleted successfully", competitionId = id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting competition {id}: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting competition", error = ex.Message });
            }
        }

        private bool CompetitionExists(int id)
        {
            return _context.Competitions.Any(e => e.CompId == id);
        }
    }
}