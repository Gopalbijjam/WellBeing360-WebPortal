using System.ComponentModel.DataAnnotations;

namespace WellBeing360.WellnessService.DTOs
{
    public class ActivityLogRequest
    {
        [Required]
        public int ChallengeID { get; set; }

        [Required]
        public double ActivityValue { get; set; }
    }
}
