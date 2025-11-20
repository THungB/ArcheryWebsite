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
        public async Task<ActionResult<IEnumerable<StagingScoreResponseDto>>> GetPendingScores()
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

                // Map to DTO to avoid circular references
                var responseDtos = pendingScores.Select(ss => new StagingScoreResponseDto
                {
                    StagingId = ss.StagingId,
                    ArcherId = ss.ArcherId,
                    RoundId = ss.RoundId,
                    EquipmentId = ss.EquipmentId,
                    DateTime = ss.DateTime,
                    RawScore = ss.RawScore,
                    Status = ss.Status ?? "pending",
                    ArcherName = $"{ss.Archer.FirstName} {ss.Archer.LastName}",
                    RoundName = ss.Round.RoundName,
                    EquipmentType = ss.Equipment.DivisionType
                }).ToList();

                return Ok(responseDtos);
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
        public async Task<ActionResult<StagingScoreResponseDto>> CreateStagingScore(CreateStagingScoreDto dto)
        {
            try
            {
                // 1. Validation cơ bản
                if (dto.ArcherId <= 0 || dto.RoundId <= 0 || dto.EquipmentId <= 0)
                    return BadRequest(new { message = "Invalid IDs provided" });

                if (dto.Arrows == null || dto.Arrows.Length == 0)
                    return BadRequest(new { message = "Arrow scores are required" });

                // 2. Tính toán tổng điểm từ mảng mũi tên (Server-side validation)
                int calculatedTotal = 0;
                foreach (var arrow in dto.Arrows)
                {
                    string cleanArrow = arrow.ToUpper().Trim();
                    if (cleanArrow == "X" || cleanArrow == "10") calculatedTotal += 10;
                    else if (cleanArrow == "M") calculatedTotal += 0;
                    else if (int.TryParse(cleanArrow, out int val))
                    {
                        if (val < 0 || val > 10) return BadRequest(new { message = $"Invalid arrow value: {val}" });
                        calculatedTotal += val;
                    }
                    else return BadRequest(new { message = $"Invalid arrow format: {arrow}" });
                }

                // 3. Kiểm tra tồn tại (giữ nguyên logic cũ)
                var archer = await _context.Archers.FindAsync(dto.ArcherId);
                var round = await _context.Rounds.FindAsync(dto.RoundId);
                var equipment = await _context.Equipment.FindAsync(dto.EquipmentId);
                
                if (archer == null || round == null || equipment == null)
                    return BadRequest(new { message = "Entity not found" });

                // 4. Tạo Staging Score với chi tiết mũi tên
                var stagingScore = new Stagingscore
                {
                    ArcherId = dto.ArcherId,
                    RoundId = dto.RoundId,
                    EquipmentId = dto.EquipmentId,
                    RawScore = calculatedTotal, // Tổng điểm tính bởi server
                    ArrowValues = System.Text.Json.JsonSerializer.Serialize(dto.Arrows), // Lưu JSON
                    Status = "pending",
                    DateTime = DateTime.Now
                };

                _context.Stagingscores.Add(stagingScore);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Score submitted", id = stagingScore.StagingId });
            }
            catch (Exception ex)
            {
                // [SỬA ĐOẠN NÀY] Lấy lỗi chi tiết từ bên trong (InnerException)
                var detailedError = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                
                // Log ra console của server (terminal chạy dotnet run) để bạn dễ nhìn thấy
                Console.WriteLine($"Error creating score: {detailedError}");

                // Trả về lỗi chi tiết cho Frontend
                return StatusCode(500, new { message = "Error creating score", error = detailedError });
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
