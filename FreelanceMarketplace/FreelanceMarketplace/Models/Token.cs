using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreelanceMarketplace.Models
{
    public class RefreshTokens
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Token { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        public bool IsUsed { get; set; } = false;
        public bool IsRevoked { get; set; } = false;

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public Users? User { get; set; }
    }
}
