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
            var pendingScores = await _context.Stagingscores
                .Where(ss => ss.Status == "pending")
                .Include(ss => ss.Archer)
                .Include(ss => ss.Round)
                .Include(ss => ss.Equipment)
                .OrderBy(ss => ss.DateTime)
                .ToListAsync();

            return Ok(pendingScores.Select(ss => new StagingScoreResponseDto
            {
                StagingId = ss.StagingId,
                ArcherId = ss.ArcherId,
                RoundId = ss.RoundId,
                EquipmentId = ss.EquipmentId,
                DateTime = ss.DateTime,
                RawScore = ss.RawScore,
                Status = ss.Status ?? "pending",
                ArrowValues = ss.ArrowValues ?? "[]",
                ArcherName = $"{ss.Archer.FirstName} {ss.Archer.LastName}",
                RoundName = ss.Round.RoundName,
                EquipmentType = ss.Equipment.DivisionType
            }));
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

                // 1. Deserialize
                var stagedData = JsonSerializer.Deserialize<List<StagedRangeData>>(stagingScore.ArrowValues ?? "[]");
                if (stagedData == null || !stagedData.Any()) throw new Exception("Invalid data.");

                // 2. Load Round Ranges
                var roundRanges = await _context.Roundranges
                    .Where(rr => rr.RoundId == stagingScore.RoundId)
                    .OrderBy(rr => rr.SequenceNumber)
                    .ToListAsync();

                int grandTotal = 0;

                // 3. Create Score
                var score = new Score
                {
                    ArcherId = stagingScore.ArcherId,
                    RoundId = stagingScore.RoundId,
                    CompId = competitionId,
                    DateShot = DateOnly.FromDateTime(stagingScore.DateTime),
                    TotalScore = 0
                };
                _context.Scores.Add(score);
                await _context.SaveChangesAsync();

                // 4. Process Ranges
                for (int i = 0; i < stagedData.Count; i++)
                {
                    var rangeData = stagedData[i];
                    var matchingRoundRange = roundRanges.FirstOrDefault(rr => rr.SequenceNumber == i + 1);
                    
                    int rangeIdToUse = matchingRoundRange?.RangeId ?? rangeData.RangeId;
                    int? roundRangeIdToUse = matchingRoundRange?.Id;

                    for (int endIdx = 0; endIdx < rangeData.Ends.Count; endIdx++)
                    {
                        var arrowStrings = rangeData.Ends[endIdx];

                        // [UPDATED] SORTING LOGIC: Highest to Lowest (X -> 10 -> 9 ... -> M)
                        var sortedArrows = arrowStrings
                            .Select(a => new { 
                                Original = a, 
                                SortValue = GetSortValue(a) 
                            })
                            .OrderByDescending(x => x.SortValue)
                            .Select(x => x.Original)
                            .ToList();

                        var end = new End
                        {
                            ScoreId = score.ScoreId,
                            RangeId = rangeIdToUse,
                            RoundRangeId = roundRangeIdToUse,
                            EndNumber = endIdx + 1,
                            EndScore = 0
                        };
                        _context.Ends.Add(end);
                        await _context.SaveChangesAsync();

                        int endTotal = 0;
                        foreach (var valStr in sortedArrows) // Use sorted list
                        {
                            int point = 0;
                            bool isX = false;
                            string cleanVal = valStr.ToUpper().Trim();
                            
                            if (cleanVal == "X") { point = 10; isX = true; }
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

                score.TotalScore = grandTotal;
                stagingScore.Status = "approved";
                stagingScore.RawScore = grandTotal;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Score approved", scoreId = score.ScoreId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error approving", error = ex.Message });
            }
        }

        // Helper for sorting
        private int GetSortValue(string val)
        {
            var v = val.ToUpper().Trim();
            if (v == "X") return 11; // Highest
            if (v == "M" || v == "") return -1; // Lowest
            if (int.TryParse(v, out int p)) return p;
            return 0;
        }

        // PUT: api/StagingScore/5/reject
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectScore(int id, [FromBody] string reason)
        {
            var stagingScore = await _context.Stagingscores.FindAsync(id);
            if (stagingScore == null) return NotFound();
            stagingScore.Status = "rejected";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Rejected" });
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