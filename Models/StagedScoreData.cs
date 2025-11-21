using System.Text.Json.Serialization;

namespace ArcheryWebsite.Models
{
    public class StagedRangeData
    {
        [JsonPropertyName("rangeId")]
        public int RangeId { get; set; }

        [JsonPropertyName("ends")]
        public List<string[]> Ends { get; set; } = new List<string[]>();
    }
}