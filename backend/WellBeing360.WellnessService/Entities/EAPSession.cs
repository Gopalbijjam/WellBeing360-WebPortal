using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.WellnessService.Entities
{
    public class EAPSession
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SessionID { get; set; }

        [Required]
        [StringLength(50)]
        public string EmployeeID { get; set; } = string.Empty;

        [Required]
        public int ServiceID { get; set; }

        public DateTime RequestedDate { get; set; } = DateTime.UtcNow;
        public DateTime SessionDate { get; set; }

        [Required]
        [StringLength(100)]
        public string CounsellorRef { get; set; } = "Unassigned";

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Requested"; // Requested, Scheduled, Completed, Cancelled
    }
}
