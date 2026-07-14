using System;
using System.ComponentModel.DataAnnotations;

namespace WellBeing360.WellnessService.DTOs
{
    public class BookSessionRequest
    {
        [Required]
        public int ServiceID { get; set; }

        [Required]
        public DateTime SessionDate { get; set; }
    }
}
