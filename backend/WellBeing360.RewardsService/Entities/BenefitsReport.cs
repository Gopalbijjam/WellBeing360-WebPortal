using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.RewardsService.Entities
{
    public class BenefitsReport
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReportID { get; set; }

        [Required]
        [StringLength(50)]
        public string Scope { get; set; } = "Global"; // Department, Grade, Plan, Period, Global

        [Required]
        public string Metrics { get; set; } = string.Empty; // JSON Serialized metrics: EnrolmentRate, PremiumCost, ClaimsSubmitted, WellnessParticipation, EAPUtilisation, RecognitionCount, PointsRedeemed

        public DateTime GeneratedDate { get; set; } = DateTime.UtcNow;
    }
}
