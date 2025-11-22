using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArcheryWebsite.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        [HttpGet("{id}")]
        public async Task<ActionResult<Archer>> GetArcher(int id)
        {
            try
            {
                var archer = await _context.Archers.FindAsync(id);
                if (archer == null) return NotFound(new { message = $"Archer with ID {id} not found" });
                return Ok(archer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving archer", error = ex.Message });
            }
        }

        // POST: api/Archer
        [HttpPost]
        public async Task<ActionResult<Archer>> CreateArcher(CreateArcherDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.LastName))
                    return BadRequest(new { message = "First name and last name are required" });

                DateOnly dob;
                if (!DateOnly.TryParseExact(dto.DateOfBirth, new[] { "dd/MM/yyyy", "yyyy-MM-dd" }, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out dob))
                {
                    return BadRequest(new { message = "Date of Birth must be in DD/MM/YYYY or YYYY-MM-DD format" });
                }

                var archer = new Archer
                {
                    FirstName = dto.FirstName.Trim(),
                    LastName = dto.LastName.Trim(),
                    Gender = dto.Gender,
                    DateOfBirth = dob,
                    Email = dto.Email.Trim(),
                    Phone = dto.Phone,
                    DefaultEquipmentId = dto.DefaultEquipmentId ?? 1
                };

                _context.Archers.Add(archer);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetArcher), new { id = archer.ArcherId }, archer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating archer", error = ex.Message });
            }
        }

        // PUT: api/Archer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArcher(int id, Archer archer)
        {
            if (id != archer.ArcherId) return BadRequest(new { message = "Archer ID mismatch" });

            try
            {
                var existingArcher = await _context.Archers.FindAsync(id);
                if (existingArcher == null) return NotFound(new { message = $"Archer with ID {id} not found" });

                existingArcher.FirstName = archer.FirstName;
                existingArcher.LastName = archer.LastName;
                existingArcher.Gender = archer.Gender;
                existingArcher.DateOfBirth = archer.DateOfBirth;
                existingArcher.Email = archer.Email;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Archer updated successfully", archer = existingArcher });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating archer", error = ex.Message });
            }
        }

        // DELETE: api/Archer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArcher(int id)
        {
            try
            {
                var archer = await _context.Archers.FindAsync(id);
                if (archer == null) return NotFound(new { message = $"Archer with ID {id} not found" });

                _context.Archers.Remove(archer);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Archer deleted successfully", archerId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting archer", error = ex.Message });
            }
        }

        // GET: api/Archer/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Archer>>> SearchArchers([FromQuery] string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name)) return BadRequest(new { message = "Search term is required" });
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
        [HttpGet("{id}/scores")]
        public async Task<ActionResult<IEnumerable<ScoreResponseDto>>> GetArcherScores(int id)
        {
            try
            {
                var scores = await _context.Scores
                    .Where(s => s.ArcherId == id)
                    .Include(s => s.Round)
                    .Include(s => s.Comp)
                    .OrderByDescending(s => s.DateShot)
                    .ToListAsync();

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

        // Thêm vào ArcherController.cs

        [HttpGet("{id}/analytics")]
        public async Task<ActionResult> GetArcherAnalytics(int id)
        {
            try
            {
                var scores = await _context.Scores
                    .Where(s => s.ArcherId == id)
                    .Include(s => s.Round) // Quan trọng: Cần RoundName để phân loại
                    .OrderBy(s => s.DateShot)
                    .ToListAsync();

                if (!scores.Any()) return Ok(new { hasData = false });

                // 1. Lấy danh sách tất cả các loại Round mà user đã chơi
                var roundTypes = scores.Select(s => s.Round.RoundName).Distinct().OrderBy(x => x).ToList();

                // 2. Xử lý dữ liệu cho Biểu đồ Đường (Line Chart)
                // Cần format: { date: "01/01", "WA 70/720": 650, "Canberra": null }
                var allDates = scores.Select(s => s.DateShot).Distinct().OrderBy(d => d).ToList();
                var historyData = new List<Dictionary<string, object>>();

                foreach (var date in allDates)
                {
                    var entry = new Dictionary<string, object>();
                    entry["date"] = date.ToString("dd/MM"); // Trục X

                    foreach (var roundName in roundTypes)
                    {
                        // Tìm điểm của loại Round này vào ngày này
                        var score = scores.FirstOrDefault(s => s.DateShot == date && s.Round.RoundName == roundName);
                        entry[roundName] = score != null ? score.TotalScore : null;
                    }
                    historyData.Add(entry);
                }

                // 3. Xử lý dữ liệu cho Biểu đồ Cột Chồng (Stacked Bar Chart)
                // Cần format: { range: "<600", "WA 70/720": 2, "Canberra": 0 }
                var scoreRanges = new[] { "<550", "550-600", "600-650", "650-700", "700+" };
                var distributionData = new List<Dictionary<string, object>>();

                foreach (var range in scoreRanges)
                {
                    var entry = new Dictionary<string, object>();
                    entry["range"] = range; // Trục X

                    foreach (var roundName in roundTypes)
                    {
                        var roundsScores = scores.Where(s => s.Round.RoundName == roundName);
                        int count = 0;

                        if (range == "<550") count = roundsScores.Count(s => s.TotalScore < 550);
                        else if (range == "550-600") count = roundsScores.Count(s => s.TotalScore >= 550 && s.TotalScore < 600);
                        else if (range == "600-650") count = roundsScores.Count(s => s.TotalScore >= 600 && s.TotalScore < 650);
                        else if (range == "650-700") count = roundsScores.Count(s => s.TotalScore >= 650 && s.TotalScore < 700);
                        else count = roundsScores.Count(s => s.TotalScore >= 700);

                        entry[roundName] = count;
                    }
                    distributionData.Add(entry);
                }

                // 4. Thống kê tổng quan cho AI
                var statsByRound = scores.GroupBy(s => s.Round.RoundName)
                    .Select(g => new
                    {
                        roundName = g.Key,
                        average = Math.Round(g.Average(s => s.TotalScore), 1),
                        best = g.Max(s => s.TotalScore),
                        totalEvents = g.Count(),
                        trend = g.OrderByDescending(s => s.DateShot).Take(3).Average(s => s.TotalScore) > g.Average(s => s.TotalScore) ? "Improving" : "Stable"
                    }).ToList();

                return Ok(new
                {
                    hasData = true,
                    roundTypes = roundTypes, // Danh sách tên để Frontend vẽ Line/Bar màu
                    history = historyData,
                    distribution = distributionData,
                    statsByRound = statsByRound
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error analyzing data", error = ex.Message });
            }
        }

        // [QUAN TRỌNG] Đây là hàm Data Science mà bạn đang thiếu
        // GET: api/Archer/5/personal-bests
        [HttpGet("{id}/personal-bests")]
        public async Task<ActionResult<IEnumerable<object>>> GetPersonalBests(int id)
        {
            try
            {
                // 1. Lấy tất cả điểm số của Archer này
                var scores = await _context.Scores
                    .Where(s => s.ArcherId == id)
                    .Include(s => s.Round)
                    .Include(s => s.Comp)
                    .ToListAsync();

                // Nếu chưa có điểm thì trả về danh sách rỗng
                if (!scores.Any())
                {
                    return Ok(new List<object>());
                }

                // 2. Data Analytics: Gom nhóm theo loại vòng bắn và tìm điểm cao nhất
                var personalBests = scores
                    .GroupBy(s => s.RoundId)
                    .Select(g => g.OrderByDescending(s => s.TotalScore).First())
                    .Select(s => new
                    {
                        scoreId = s.ScoreId,
                        roundName = s.Round?.RoundName ?? "Unknown Round",
                        totalScore = s.TotalScore,
                        dateShot = s.DateShot.ToString("yyyy-MM-dd"),
                        competitionName = s.Comp?.CompName ?? "Practice"
                    })
                    .ToList();

                return Ok(personalBests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving personal bests", error = ex.Message });
            }
        }
    }
}