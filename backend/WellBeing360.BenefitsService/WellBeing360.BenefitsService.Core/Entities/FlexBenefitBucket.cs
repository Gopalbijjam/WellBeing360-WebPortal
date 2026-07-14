using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.BenefitsService.Entities
{
    public class FlexBenefitBucket
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BucketID { get; set; }

        [Required]
        public int PlanID { get; set; }

        [Required]
        [StringLength(50)]
        public string BucketName { get; set; } = string.Empty; // Medical, Childcare, Fitness, Education, Transport, Meal

        [Column(TypeName = "decimal(18,2)")]
        public decimal AnnualAllowance { get; set; }

        public bool CarryForwardAllowed { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active, Inactive
    }
}
