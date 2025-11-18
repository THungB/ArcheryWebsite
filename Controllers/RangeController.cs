using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;

namespace ArcheryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RangeController : ControllerBase
    {
        private readonly ArcheryDbContext _context;

        public RangeController(ArcheryDbContext context)
        {
            _context = context;
        }

        // GET: api/Range
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.Range>>> GetRanges()
        {
            try
            {
                var ranges = await _context.Ranges
                    .OrderBy(r => r.DistanceMeters)
                    .ToListAsync();
                return Ok(ranges);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving ranges", error = ex.Message });
            }
        }

        // GET: api/Range/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Range>> GetRange(int id)
        {
            try
            {
                var range = await _context.Ranges.FindAsync(id);

                if (range == null)
                {
                    return NotFound(new { message = $"Range with ID {id} not found" });
                }

                return Ok(range);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving range", error = ex.Message });
            }
        }

        // POST: api/Range
        [HttpPost]
        public async Task<ActionResult<Models.Range>> CreateRange(Models.Range range)
        {
            try
            {
                // Validate distance
                int[] validDistances = { 18, 20, 30, 40, 50, 60, 70, 90 };
                if (!validDistances.Contains(range.DistanceMeters))
                {
                    return BadRequest(new { message = "Invalid distance. Valid distances: 18, 20, 30, 40, 50, 60, 70, 90 meters" });
                }

                if (range.EndCount <= 0)
                {
                    return BadRequest(new { message = "End count must be greater than 0" });
                }

                _context.Ranges.Add(range);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetRange),
                    new { id = range.RangeId },
                    range
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating range", error = ex.Message });
            }
        }

        // PUT: api/Range/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRange(int id, Models.Range range)
        {
            if (id != range.RangeId)
            {
                return BadRequest(new { message = "Range ID mismatch" });
            }

            try
            {
                var existingRange = await _context.Ranges.FindAsync(id);
                if (existingRange == null)
                {
                    return NotFound(new { message = $"Range with ID {id} not found" });
                }

                existingRange.DistanceMeters = range.DistanceMeters;
                existingRange.EndCount = range.EndCount;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Range updated successfully", range = existingRange });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating range", error = ex.Message });
            }
        }

        // DELETE: api/Range/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRange(int id)
        {
            try
            {
                var range = await _context.Ranges.FindAsync(id);
                if (range == null)
                {
                    return NotFound(new { message = $"Range with ID {id} not found" });
                }

                _context.Ranges.Remove(range);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Range deleted successfully", rangeId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting range", error = ex.Message });
            }
        }

        // GET: api/Range/distance/70
        [HttpGet("distance/{meters}")]
        public async Task<ActionResult<IEnumerable<Models.Range>>> GetRangesByDistance(int meters)
        {
            try
            {
                var ranges = await _context.Ranges
                    .Where(r => r.DistanceMeters == meters)
                    .ToListAsync();

                return Ok(ranges);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving ranges by distance", error = ex.Message });
            }
        }
    }
}
