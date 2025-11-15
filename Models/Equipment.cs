using System;
using System.Collections.Generic;

namespace ArcheryWebsite.Models;

public partial class Equipment
{
    public int EquipmentId { get; set; }

    public string DivisionType { get; set; } = null!;

    public virtual ICollection<Stagingscore> Stagingscores { get; set; } = new List<Stagingscore>();
}
