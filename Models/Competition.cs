using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema; // Thêm dòng này

namespace ArcheryWebsite.Models;

public partial class Competition
{
    public int CompId { get; set; }
    public string CompName { get; set; } = null!;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    [Column("location")]
    public string? Location { get; set; }
    [Column("details")]
    public string? Details { get; set; }
    public bool IsClubChampionship { get; set; } = false;
    public virtual ICollection<Score> Scores { get; set; } = new List<Score>();
}