using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.BenefitsService.Entities
{
    public class EnrolmentWindow
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WindowID { get; set; }

        [Required]
        public int PlanYear { get; set; }

        public DateTime OpenDate { get; set; }
        public DateTime CloseDate { get; set; }

        [Required]
        [StringLength(100)]
        public string EligibleGrades { get; set; } = string.Empty; // Comma-separated

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Upcoming"; // Upcoming, Open, Closed
    }
}
