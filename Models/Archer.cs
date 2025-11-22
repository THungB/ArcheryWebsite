using System.ComponentModel.DataAnnotations.Schema;

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

    [NotMapped]
    public string AgeClass
    {
        get
        {
            var age = DateTime.Now.Year - DateOfBirth.Year;

            if (age < 14) return "Under 14";
            if (age < 16) return "Under 16";
            if (age < 18) return "Under 18";
            if (age < 21) return "Under 21";
            if (age >= 50 && age < 60) return "50+ (Master)";
            if (age >= 60 && age < 70) return "60+ (Veteran)";
            if (age >= 70) return "70+";

            return "Open"; // 21 - 49
        }
    }
}
