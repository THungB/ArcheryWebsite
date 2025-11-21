namespace ArcheryWebsite.Models;

/// <summary>
/// DTO for returning archer scores
/// Avoids circular reference serialization issues
/// </summary>
public class ScoreResponseDto
{
    public int ScoreId { get; set; }
    public int ArcherId { get; set; }
    public int RoundId { get; set; }
    public int? CompId { get; set; }
    public string DateShot { get; set; } = string.Empty;
    public int TotalScore { get; set; }
    public string? RoundName { get; set; }
    public string? CompetitionName { get; set; }
}