using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;
using System.Text.Json;

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

                // Map to DTO
                var responseDtos = pendingScores.Select(ss => new StagingScoreResponseDto
                {
                    StagingId = ss.StagingId,
                    ArcherId = ss.ArcherId,
                    RoundId = ss.RoundId,
                    EquipmentId = ss.EquipmentId,
                    DateTime = ss.DateTime,
                    RawScore = ss.RawScore,
                    Status = ss.Status ?? "pending",
                    // Map ArrowValues để Frontend hiển thị chi tiết
                    ArrowValues = ss.ArrowValues ?? "[]",

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
        // [FIXED] Đã sửa để nhận ScoreData thay vì Arrows
        [HttpPost]
        public async Task<ActionResult> CreateStagingScore(CreateStagingScoreDto dto)
        {
            try
            {
                if (dto.ArcherId <= 0 || dto.RoundId <= 0 || dto.EquipmentId <= 0)
                    return BadRequest(new { message = "Invalid IDs provided" });

                // SỬA LỖI Ở ĐÂY: Kiểm tra ScoreData thay vì Arrows
                if (dto.ScoreData == null || !dto.ScoreData.Any())
                    return BadRequest(new { message = "Score data is required" });

                // Serialize ScoreData (object phức tạp) thành chuỗi JSON
                var jsonOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                string jsonArrowValues = JsonSerializer.Serialize(dto.ScoreData, jsonOptions);

                var stagingScore = new Stagingscore
                {
                    ArcherId = dto.ArcherId,
                    RoundId = dto.RoundId,
                    EquipmentId = dto.EquipmentId,
                    RawScore = 0, // Điểm thô tạm thời = 0, sẽ tính lại khi Approve
                    ArrowValues = jsonArrowValues, // Lưu chuỗi JSON đúng định dạng mới
                    Status = "pending",
                    DateTime = DateTime.Now
                };

                _context.Stagingscores.Add(stagingScore);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Score submitted", id = stagingScore.StagingId });
            }
            catch (Exception ex)
            {
                var detailedError = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                Console.WriteLine($"Error creating score: {detailedError}");
                return StatusCode(500, new { message = "Error creating score", error = detailedError });
            }
        }

        // PUT: api/StagingScore/5/approve
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveScore(int id, [FromQuery] int? competitionId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var stagingScore = await _context.Stagingscores.FindAsync(id);
                if (stagingScore == null) return NotFound("Staging score not found");
                if (stagingScore.Status == "approved") return BadRequest("Already approved");

                // 1. Deserialize JSON Data
                // JSON structure: List<StagedRangeData>
                var stagedData = JsonSerializer.Deserialize<List<StagedRangeData>>(stagingScore.ArrowValues ?? "[]");
                if (stagedData == null || !stagedData.Any())
                    throw new Exception("Invalid or empty score data.");

                // Load cấu trúc RoundRange của Round này để map đúng Sequence
                var roundRanges = await _context.Roundranges
                    .Where(rr => rr.RoundId == stagingScore.RoundId)
                    .OrderBy(rr => rr.SequenceNumber)
                    .ToListAsync();

                int grandTotal = 0;

                // 3. Tạo Score Record
                var score = new Score
                {
                    ArcherId = stagingScore.ArcherId,
                    RoundId = stagingScore.RoundId,
                    CompId = competitionId,
                    DateShot = DateOnly.FromDateTime(stagingScore.DateTime),
                    TotalScore = 0 // Sẽ cập nhật sau khi cộng dồn
                };
                _context.Scores.Add(score);
                await _context.SaveChangesAsync(); // Để lấy ScoreId

                // 4. Duyệt qua từng Range (Hiệp)
                for (int i = 0; i < stagedData.Count; i++)
                {
                    var rangeData = stagedData[i];
                    // Tìm RoundRange tương ứng dựa vào Sequence (i + 1)
                    var matchingRoundRange = roundRanges.FirstOrDefault(rr => rr.SequenceNumber == i + 1);
                    
                    int rangeIdToUse = matchingRoundRange?.RangeId ?? rangeData.RangeId;
                    int? roundRangeIdToUse = matchingRoundRange?.Id;

                    for (int endIdx = 0; endIdx < rangeData.Ends.Count; endIdx++)
                    {
                        var arrowStrings = rangeData.Ends[endIdx]; // Mảng string ["10", "X", "M"...]
                        var end = new End
                        {
                            ScoreId = score.ScoreId,
                            RangeId = rangeIdToUse,
                            RoundRangeId = roundRangeIdToUse, // Lưu định danh chính xác của hiệp đấu
                            EndNumber = endIdx + 1,
                            EndScore = 0
                        };
                        _context.Ends.Add(end);
                        await _context.SaveChangesAsync(); // Để lấy EndId

                        int endTotal = 0;
                        foreach (var valStr in arrowStrings)
                        {
                            int point = 0;
                            bool isX = false;
                            string cleanVal = valStr.ToUpper().Trim();
                            
                            if (cleanVal == "X") 
                            {
                                point = 10;
                                isX = true;
                            }
                            else if (cleanVal == "10") point = 10;
                            else if (cleanVal == "M" || cleanVal == "") point = 0;
                            else int.TryParse(cleanVal, out point);

                            endTotal += point;

                            var arrow = new Arrow
                            {
                                EndId = end.EndId,
                                ArrowValue = point,
                                IsX = isX
                            };
                            _context.Arrows.Add(arrow);
                        }
                        end.EndScore = endTotal;
                        grandTotal += endTotal;
                    }
                }

                // 6. Cập nhật tổng điểm cuối cùng cho Score và StagingScore
                score.TotalScore = grandTotal;
                stagingScore.Status = "approved";
                stagingScore.RawScore = grandTotal;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Score approved and processed successfully", scoreId = score.ScoreId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error processing approval", error = ex.Message });
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

                return Ok(new
                {
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