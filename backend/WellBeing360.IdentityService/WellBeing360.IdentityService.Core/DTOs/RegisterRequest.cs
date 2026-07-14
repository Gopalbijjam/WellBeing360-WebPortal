using System.ComponentModel.DataAnnotations;

namespace WellBeing360.IdentityService.DTOs
{
    public class RegisterRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public string GradeID { get; set; } = string.Empty;

        [Required]
        public string DepartmentID { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
