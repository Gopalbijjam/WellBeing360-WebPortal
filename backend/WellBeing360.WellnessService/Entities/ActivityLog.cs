using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.WellnessService.Entities
{
    public class ActivityLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LogID { get; set; }

        [Required]
        public int ChallengeID { get; set; }

        [Required]
        [StringLength(50)]
        public string EmployeeID { get; set; } = string.Empty;

        public DateTime LogDate { get; set; }
        public double ActivityValue { get; set; }
        public int PointsEarned { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Submitted"; // Submitted, Verified
    }
}
