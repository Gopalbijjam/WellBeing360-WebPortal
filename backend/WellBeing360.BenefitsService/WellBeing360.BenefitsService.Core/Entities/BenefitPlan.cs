using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.BenefitsService.Entities
{
    public class BenefitPlan
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PlanID { get; set; }

        [Required]
        [StringLength(100)]
        public string PlanName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string PlanType { get; set; } = string.Empty; // GroupHealthInsurance, LifeCover, DentalVision, FlexibleBenefit, RetirementContribution, Commuter

        [Required]
        [StringLength(50)]
        public string EligibilityGrade { get; set; } = string.Empty; // Comma-separated: e.g. "G1,G2,G3"

        [Column(TypeName = "decimal(18,2)")]
        public decimal EmployeeContribution { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal EmployerContribution { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal CoverageLimit { get; set; }

        public DateTime EffectiveDate { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active, Discontinued
    }
}
