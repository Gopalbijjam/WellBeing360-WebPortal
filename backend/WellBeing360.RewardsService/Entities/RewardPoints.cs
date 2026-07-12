using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.RewardsService.Entities
{
    public class RewardPoints
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PointsID { get; set; }

        [Required]
        [StringLength(50)]
        public string EmployeeID { get; set; } = string.Empty;

        public int TotalEarned { get; set; }
        public int TotalRedeemed { get; set; }
        public int Balance { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}
