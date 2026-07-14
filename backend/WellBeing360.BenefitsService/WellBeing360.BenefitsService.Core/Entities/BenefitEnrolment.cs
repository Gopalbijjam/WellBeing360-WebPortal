using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.BenefitsService.Entities
{
    public class BenefitEnrolment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EnrolmentID { get; set; }

        [Required]
        [StringLength(50)]
        public string EmployeeID { get; set; } = string.Empty;

        [Required]
        public int PlanID { get; set; }

        [Required]
        public int WindowID { get; set; }

        [Required]
        [StringLength(50)]
        public string CoverageOption { get; set; } = string.Empty; // Individual, Family, SpouseOnly, ChildOnly

        public bool DependentsIncluded { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal EmployeeContributionAmount { get; set; }

        public DateTime EffectiveDate { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Draft"; // Draft, Submitted, Active, Lapsed, Cancelled
    }
}
