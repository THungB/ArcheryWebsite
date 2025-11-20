namespace ArcheryWebsite.Models;

/// <summary>
/// DTO for creating a staging score
/// Only accepts the required IDs, not the full navigation objects
/// </summary>
public class CreateStagingScoreDto
{
    public int ArcherId { get; set; }
    public int RoundId { get; set; }
    public int EquipmentId { get; set; }
    public string[] Arrows { get; set; } = Array.Empty<string>();
}
