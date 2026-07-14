using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.WellnessService.Entities
{
    public class WellnessChallenge
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ChallengeID { get; set; }

        [Required]
        public int ProgramID { get; set; }

        [Required]
        [StringLength(100)]
        public string ChallengeName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string ActivityType { get; set; } = string.Empty; // Steps, Meditation, WaterIntake, SleepLog, NutritionTrack

        public int DailyTarget { get; set; }
        public int Duration { get; set; } // days

        public int PointsPerCompletion { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active, Completed
    }
}
