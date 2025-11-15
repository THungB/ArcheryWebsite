using System;
using System.Collections.Generic;

namespace ArcheryWebsite.Models;

public partial class Competition
{
    public int CompId { get; set; }

    public string CompName { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public virtual ICollection<Score> Scores { get; set; } = new List<Score>();
}
