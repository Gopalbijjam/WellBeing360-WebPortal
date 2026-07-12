using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.RewardsService.Entities
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NotificationID { get; set; }

        [Required]
        [StringLength(50)]
        public string UserID { get; set; } = string.Empty; // Store EmployeeID here for simplified query

        [Required]
        [StringLength(250)]
        public string Message { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty; // Enrolment, Wellness, EAP, Recognition, Benefits

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Unread"; // Unread, Read, Dismissed

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
