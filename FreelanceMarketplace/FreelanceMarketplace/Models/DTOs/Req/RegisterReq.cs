using System.ComponentModel.DataAnnotations;

namespace FreelanceMarketplace.Models.DTOs.Req
{
    public class RegisterReq
    {
        [Required(ErrorMessage = "Username must be required")]
        [MaxLength(50)]
        public string? Username { get; set; }

        [Required(ErrorMessage = "Password must be required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        [DataType(DataType.Password)]
        public string? Password { get; set; }

        [Required(ErrorMessage = "Email must be required")]
        [DataType(DataType.EmailAddress)]
        public string? Email { get; set; }

        public string? Role { get; set; } = "Client";
    }
}
