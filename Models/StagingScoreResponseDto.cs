namespace ArcheryWebsite.Models;

/// <summary>
/// DTO for returning a created staging score
/// Only returns necessary information without circular references
/// </summary>
public class StagingScoreResponseDto
{
    public int StagingId { get; set; }
    public int ArcherId { get; set; }
    public int RoundId { get; set; }
    public int EquipmentId { get; set; }
    public DateTime DateTime { get; set; }
    public int RawScore { get; set; }
    public string Status { get; set; }
    public string ArrowValues { get; set; } = "[]";
    public string? ArcherName { get; set; }
    public string? RoundName { get; set; }
    public string? EquipmentType { get; set; }
}
