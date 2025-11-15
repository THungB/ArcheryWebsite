using System;
using System.Collections.Generic;

namespace ArcheryWebsite.Models;

public partial class Range
{
    public int RangeId { get; set; }

    public int DistanceMeters { get; set; }

    public int EndCount { get; set; }

    public virtual ICollection<End> Ends { get; set; } = new List<End>();

    public virtual ICollection<Roundrange> Roundranges { get; set; } = new List<Roundrange>();
}
