using System.ComponentModel.DataAnnotations;

namespace WellBeing360.RewardsService.DTOs
{
    public class InternalAddPointsRequest
    {
        [Required]
        public string EmployeeID { get; set; } = string.Empty;

        [Required]
        public int Points { get; set; }

        [Required]
        public string Reason { get; set; } = string.Empty;
    }
}
