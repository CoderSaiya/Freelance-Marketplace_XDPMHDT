using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreelanceMarketplace.Models
{
    [Table("Users")]
    public class Users
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string? Username { get; set; }
        [Required]
        [MaxLength(250)]
        public string? PasswordHash { get; set; }
        public string? Role { get; set; }
        public ICollection<RefreshTokens> RefreshTokens { get; set; } = new List<RefreshTokens>();
    }
}
