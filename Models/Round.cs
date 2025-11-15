using System;
using System.Collections.Generic;

namespace ArcheryWebsite.Models;

public partial class Round
{
    public int RoundId { get; set; }

    public string RoundName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Roundrange> Roundranges { get; set; } = new List<Roundrange>();

    public virtual ICollection<Score> Scores { get; set; } = new List<Score>();

    public virtual ICollection<Stagingscore> Stagingscores { get; set; } = new List<Stagingscore>();
}
