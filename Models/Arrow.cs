using System;
using System.Collections.Generic;

namespace ArcheryWebsite.Models;

public partial class Arrow
{
    public int ArrowId { get; set; }

    public int EndId { get; set; }

    public int ArrowValue { get; set; }

    public virtual End End { get; set; } = null!;
}
