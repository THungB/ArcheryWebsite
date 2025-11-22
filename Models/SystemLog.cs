using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArcheryWebsite.Models
{
    [Table("system_log")]
    public class SystemLog
    {
        [Key]
        [Column("log_id")]
        public int LogId { get; set; }

        [Column("timestamp")]
        public DateTime Timestamp { get; set; } = DateTime.Now;

        [Column("level")]
        public string Level { get; set; } = "info";

        [Column("user")]
        public string User { get; set; } = "System";

        [Column("action")]
        public string Action { get; set; } = string.Empty;

        [Column("details")]
        public string Details { get; set; } = string.Empty;

        [Column("ip_address")]
        public string IpAddress { get; set; } = "::1";
    }
}