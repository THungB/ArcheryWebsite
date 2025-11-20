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
        public async Task<ActionResult<Archer>> CreateArcher(CreateArcherDto dto)
        {
            try
            {
                // Validation: Check required fields
                if (string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.LastName))
                {
                    return BadRequest(new { message = "First name and last name are required" });
                }

                // Validate Gender
                var validGenders = new[] { "Male", "Female", "Other" };
                if (string.IsNullOrWhiteSpace(dto.Gender) || !validGenders.Contains(dto.Gender))
                {
                    return BadRequest(new { message = "Gender must be 'Male', 'Female', or 'Other'" });
                }

                // Validate Email format
                if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@"))
                {
                    return BadRequest(new { message = "Valid email address is required" });
                }

                // Parse Date of Birth (handle DD/MM/YYYY and YYYY-MM-DD formats)
                DateOnly dob;
                if (DateOnly.TryParseExact(dto.DateOfBirth, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var dobDDMMYY))
                {
                    dob = dobDDMMYY;
                }
                else if (DateOnly.TryParseExact(dto.DateOfBirth, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var dobISO))
                {
                    dob = dobISO;
                }
                else
                {
                    return BadRequest(new { message = "Date of Birth must be in DD/MM/YYYY or YYYY-MM-DD format" });
                }

                // Verify Default Equipment exists (if provided)
                if (dto.DefaultEquipmentId.HasValue && dto.DefaultEquipmentId > 0)
                {
                    var equipment = await _context.Equipment.FindAsync(dto.DefaultEquipmentId);
                    if (equipment == null)
                    {
                        return BadRequest(new { message = $"Equipment with ID {dto.DefaultEquipmentId} not found" });
                    }
                }

                // Create new archer
                var archer = new Archer
                {
                    FirstName = dto.FirstName.Trim(),
                    LastName = dto.LastName.Trim(),
                    Gender = dto.Gender,
                    DateOfBirth = dob,
                    Email = dto.Email.Trim(),
                    Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim(),
                    DefaultEquipmentId = dto.DefaultEquipmentId ?? 1,
                    UserId = null // User ID is optional - archer may not have account yet
                };

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