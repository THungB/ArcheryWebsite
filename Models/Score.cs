using System;
using System.Collections.Generic;

namespace ArcheryWebsite.Models;

public partial class Score
{
    public int ScoreId { get; set; }

    public int ArcherId { get; set; }

    public int RoundId { get; set; }

    public int? CompId { get; set; }

    public DateOnly DateShot { get; set; }

    public int TotalScore { get; set; }

    public virtual Archer Archer { get; set; } = null!;

    public virtual Competition? Comp { get; set; }

    public virtual ICollection<End> Ends { get; set; } = new List<End>();

    public virtual Round Round { get; set; } = null!;
}
