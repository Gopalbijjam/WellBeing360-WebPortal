using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WellBeing360.WellnessService.Entities
{
    public class WellnessProgram
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProgramID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Theme { get; set; } = string.Empty; // Fitness, Nutrition, MentalHealth, Preventive, WorkLifeBalance

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int PointsOnOffer { get; set; }
        public int TargetParticipation { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Upcoming"; // Upcoming, Active, Completed
    }
}
