using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.RewardsService.Entities
{
    public class RecognitionAward
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AwardID { get; set; }

        [Required]
        [StringLength(50)]
        public string NominatorID { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string RecipientID { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty; // PeerRecognition, ManagerNomination, MilestoneAward, InnovationAward

        [Required]
        [StringLength(50)]
        public string BadgeName { get; set; } = string.Empty;

        public int PointsAwarded { get; set; }

        [Required]
        [StringLength(500)]
        public string Message { get; set; } = string.Empty;

        public DateTime AwardDate { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Awarded"; // Awarded, Revoked
    }
}
