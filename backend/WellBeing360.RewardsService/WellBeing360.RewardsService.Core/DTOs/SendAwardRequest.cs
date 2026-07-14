using System.ComponentModel.DataAnnotations;

namespace WellBeing360.RewardsService.DTOs
{
    public class SendAwardRequest
    {
        [Required]
        public string RecipientID { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty; // PeerRecognition, ManagerNomination, MilestoneAward, InnovationAward

        [Required]
        public string BadgeName { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;
    }
}
