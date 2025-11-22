namespace ArcheryWebsite.Models;

public partial class Roundrange
{
    public int Id { get; set; }

    public int RoundId { get; set; }

    public int RangeId { get; set; }

    public int SequenceNumber { get; set; }

    public virtual Range Range { get; set; } = null!;

    public virtual Round Round { get; set; } = null!;
}
