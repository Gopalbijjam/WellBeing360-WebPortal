using System.ComponentModel.DataAnnotations;

namespace WellBeing360.RewardsService.DTOs
{
    public class RedeemRequest
    {
        [Required]
        public int ItemID { get; set; }
    }
}
