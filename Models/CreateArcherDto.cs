namespace ArcheryWebsite.Models;

/// <summary>
/// DTO for creating a new archer
/// Accepts archer registration data from frontend
/// </summary>
public class CreateArcherDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string DateOfBirth { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public int? DefaultEquipmentId { get; set; } = 1;
}