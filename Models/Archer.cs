using System;
using System.Collections.Generic;

namespace ArcheryWebsite.Models;

public partial class Archer
{
    public int ArcherId { get; set; }

    public int? UserId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public int DefaultEquipmentId { get; set; } = 1;

    public virtual ICollection<Score> Scores { get; set; } = new List<Score>();

    public virtual ICollection<Stagingscore> Stagingscores { get; set; } = new List<Stagingscore>();
}
