using System.ComponentModel.DataAnnotations;

namespace WellBeing360.IdentityService.DTOs
{
    public class UpdateUserStatusRequest
    {
        [Required]
        [RegularExpression("^(Active|Inactive)$", ErrorMessage = "Status must be either 'Active' or 'Inactive'.")]
        public string Status { get; set; } = string.Empty;
    }
}
