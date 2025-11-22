namespace ArcheryWebsite.Models;

public partial class Stagingscore
{
    public int StagingId { get; set; }
    public int ArcherId { get; set; }
    public int RoundId { get; set; }
    public int EquipmentId { get; set; }
    public DateTime DateTime { get; set; }
    public int RawScore { get; set; }
    public string? Status { get; set; }
    public string? ArrowValues { get; set; } = "[]";

    public virtual Archer Archer { get; set; } = null!;
    public virtual Equipment Equipment { get; set; } = null!;
    public virtual Round Round { get; set; } = null!;
}