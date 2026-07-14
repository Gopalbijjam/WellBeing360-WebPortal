using System;
using System.ComponentModel.DataAnnotations;

namespace WellBeing360.BenefitsService.DTOs
{
    public class DependentRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Relationship { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfBirth { get; set; }
    }
}
