using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;

namespace ArcheryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentController : ControllerBase
    {
        private readonly ArcheryDbContext _context;

        public EquipmentController(ArcheryDbContext context)
        {
            _context = context;
        }

        // GET: api/Equipment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipment()
        {
            try
            {
                var equipment = await _context.Equipment.ToListAsync();
                return Ok(equipment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving equipment", error = ex.Message });
            }
        }

        // GET: api/Equipment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Equipment>> GetEquipment(int id)
        {
            try
            {
                var equipment = await _context.Equipment.FindAsync(id);

                if (equipment == null)
                {
                    return NotFound(new { message = $"Equipment with ID {id} not found" });
                }

                return Ok(equipment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving equipment", error = ex.Message });
            }
        }

        // POST: api/Equipment
        [HttpPost]
        public async Task<ActionResult<Equipment>> CreateEquipment(Equipment equipment)
        {
            try
            {
                _context.Equipment.Add(equipment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetEquipment),
                    new { id = equipment.EquipmentId },
                    equipment
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating equipment", error = ex.Message });
            }
        }

        // PUT: api/Equipment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEquipment(int id, Equipment equipment)
        {
            if (id != equipment.EquipmentId)
            {
                return BadRequest(new { message = "Equipment ID mismatch" });
            }

            try
            {
                _context.Entry(equipment).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Equipment updated successfully", equipment });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipmentExists(id))
                {
                    return NotFound(new { message = $"Equipment with ID {id} not found" });
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating equipment", error = ex.Message });
            }
        }

        // DELETE: api/Equipment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            try
            {
                var equipment = await _context.Equipment.FindAsync(id);
                if (equipment == null)
                {
                    return NotFound(new { message = $"Equipment with ID {id} not found" });
                }

                _context.Equipment.Remove(equipment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Equipment deleted successfully", equipmentId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting equipment", error = ex.Message });
            }
        }

        private bool EquipmentExists(int id)
        {
            return _context.Equipment.Any(e => e.EquipmentId == id);
        }
    }
}