using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;

namespace ArcheryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArcherController : ControllerBase
    {
        private readonly ArcheryDbContext _context;

        public ArcherController(ArcheryDbContext context)
        {
            _context = context;
        }

        // GET: api/Archer
        // Get all archers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Archer>>> GetArchers()
        {
            try
            {
                var archers = await _context.Archers.ToListAsync();
                return Ok(archers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving archers", error = ex.Message });
            }
        }

        // GET: api/Archer/5
        // Get single archer by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Archer>> GetArcher(int id)
        {
            try
            {
                var archer = await _context.Archers.FindAsync(id);

                if (archer == null)
                {
                    return NotFound(new { message = $"Archer with ID {id} not found" });
                }

                return Ok(archer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving archer", error = ex.Message });
            }
        }

        // POST: api/Archer
        // Create new archer
        [HttpPost]
        public async Task<ActionResult<Archer>> CreateArcher(Archer archer)
        {
            try
            {
                // Validation Name
                if (string.IsNullOrWhiteSpace(archer.FirstName) || 
                    string.IsNullOrWhiteSpace(archer.LastName))
                {
                    return BadRequest(new { message = "First name and last name are required" });
                }

                // Validate Gender matches the Database Enum
                var validGenders = new[] { "Male", "Female", "Other" };
                if (!validGenders.Contains(archer.Gender))
                {
                    return BadRequest(new { message = "Gender must be 'Male', 'Female', or 'Other'." });
                }

                // Validation Email 
                if (!string.IsNullOrWhiteSpace(archer.Email) && 
                    !archer.Email.Contains("@"))
                {
                    return BadRequest(new { message = "Invalid email format" });
                }

                _context.Archers.Add(archer);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetArcher), 
                    new { id = archer.ArcherId }, 
                    archer
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating archer", error = ex.Message });
            }
        }

        // PUT: api/Archer/5
        // Update existing archer
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArcher(int id, Archer archer)
        {
            if (id != archer.ArcherId)
            {
                return BadRequest(new { message = "Archer ID mismatch" });
            }

            try
            {
                // Check if archer exists
                var existingArcher = await _context.Archers.FindAsync(id);
                if (existingArcher == null)
                {
                    return NotFound(new { message = $"Archer with ID {id} not found" });
                }

                // Update properties
                existingArcher.FirstName = archer.FirstName;
                existingArcher.LastName = archer.LastName;
                existingArcher.Gender = archer.Gender;
                existingArcher.DateOfBirth = archer.DateOfBirth;
                existingArcher.Email = archer.Email;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Archer updated successfully", archer = existingArcher });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArcherExists(id))
                {
                    return NotFound(new { message = $"Archer with ID {id} not found" });
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating archer", error = ex.Message });
            }
        }

        // DELETE: api/Archer/5
        // Delete archer
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArcher(int id)
        {
            try
            {
                var archer = await _context.Archers.FindAsync(id);
                if (archer == null)
                {
                    return NotFound(new { message = $"Archer with ID {id} not found" });
                }

                _context.Archers.Remove(archer);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Archer deleted successfully", archerId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting archer", error = ex.Message });
            }
        }

        // GET: api/Archer/search?name=john
        // Search archers by name
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Archer>>> SearchArchers([FromQuery] string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name))
                {
                    return BadRequest(new { message = "Search term is required" });
                }

                var archers = await _context.Archers
                    .Where(a => a.FirstName.Contains(name) || a.LastName.Contains(name))
                    .ToListAsync();

                return Ok(archers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error searching archers", error = ex.Message });
            }
        }

        // GET: api/Archer/5/scores
        // Get all scores for a specific archer
        [HttpGet("{id}/scores")]
        public async Task<ActionResult<IEnumerable<ScoreResponseDto>>> GetArcherScores(int id)
        {
            try
            {
                var archer = await _context.Archers.FindAsync(id);
                if (archer == null)
                {
                    return NotFound(new { message = $"Archer with ID {id} not found" });
                }

                var scores = await _context.Scores
                    .Where(s => s.ArcherId == id)
                    .Include(s => s.Round)
                    .Include(s => s.Comp)
                    .OrderByDescending(s => s.DateShot)
                    .ToListAsync();

                // Map to DTO to avoid circular references
                var responseDtos = scores.Select(s => new ScoreResponseDto
                {
                    ScoreId = s.ScoreId,
                    ArcherId = s.ArcherId,
                    RoundId = s.RoundId,
                    CompId = s.CompId,
                    DateShot = s.DateShot.ToString("yyyy-MM-dd"),
                    TotalScore = s.TotalScore,
                    RoundName = s.Round?.RoundName,
                    CompetitionName = s.Comp?.CompName
                }).ToList();

                return Ok(responseDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving archer scores", error = ex.Message });
            }
        }

        // Helper method to check if archer exists
        private bool ArcherExists(int id)
        {
            return _context.Archers.Any(e => e.ArcherId == id);
        }
    }
}