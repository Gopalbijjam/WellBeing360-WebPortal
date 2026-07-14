using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WellBeing360.BenefitsService.DTOs
{
    public class EnrolmentRequest
    {
        [Required]
        public int PlanID { get; set; }

        [Required]
        public int WindowID { get; set; }

        [Required]
        public string CoverageOption { get; set; } = string.Empty;

        public bool DependentsIncluded { get; set; }

        public decimal EmployeeContributionAmount { get; set; }

        public List<DependentRequest> Dependents { get; set; } = new();
    }
}
