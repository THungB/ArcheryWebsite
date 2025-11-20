namespace ArcheryWebsite.Models;

/// <summary>
/// DTO for creating a new archer
/// Accepts archer registration data from frontend
/// </summary>
public class CreateArcherDto
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Gender { get; set; } = null!;
    public string DateOfBirth { get; set; } = null!; // Accept as string (DD/MM/YYYY or YYYY-MM-DD)
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public int? DefaultEquipmentId { get; set; } = 1;
}
