using System;
using System.Collections.Generic;

namespace ArcheryWebsite.Models;

public partial class RoundEquivalence
{
    public int EquivalenceId { get; set; }
    public int RoundId { get; set; }
    public int EquivalentRoundId { get; set; }
    public DateOnly ValidFrom { get; set; } = DateOnly.FromDateTime(DateTime.Now);
    public DateOnly? ValidTo { get; set; }

    public virtual Round Round { get; set; } = null!;
    public virtual Round EquivalentRound { get; set; } = null!;
}