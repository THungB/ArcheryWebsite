namespace ArcheryWebsite.Models
{
    public class RoundStructureDto
    {
        public int RoundId { get; set; }
        public string RoundName { get; set; } = string.Empty;
        public List<RangeDetailDto> Ranges { get; set; } = new List<RangeDetailDto>();
    }

    public class RangeDetailDto
    {
        public int SequenceNumber { get; set; }
        public int RangeId { get; set; }
        public int DistanceMeters { get; set; }
        public int EndCount { get; set; }
        public int ArrowsPerEnd { get; set; } = 6;
        public int FaceSizeCm { get; set; }
    }
}