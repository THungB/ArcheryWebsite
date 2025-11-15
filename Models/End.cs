using System;
using System.Collections.Generic;

namespace ArcheryWebsite.Models;

public partial class End
{
    public int EndId { get; set; }

    public int ScoreId { get; set; }

    public int RangeId { get; set; }

    public int EndNumber { get; set; }

    public int EndScore { get; set; }

    public virtual ICollection<Arrow> Arrows { get; set; } = new List<Arrow>();

    public virtual Range Range { get; set; } = null!;

    public virtual Score Score { get; set; } = null!;
}
