using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FreelanceMarketplace.Models
{
    public class UserProfile
    {
        [Key]
        public int Id { get; set; }
        public string? FullName { get; set; }
        public float Rating { get; set; }
        public string? Company { get; set; }
        public string? Phone { get; set; }
        public DateTime? Birthday { get; set; }
        public string? Gender { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public string? Skill { get; set; }
        public string? Avatar { get; set; } = "/img/logo.png";
        public string? Industry { get; set; }
        [Required]
        public int UserId { get; set; }
        public string Status { get; set; } = "Active";
        [ForeignKey("UserId")]
        public Users? Users { get; set; }
    }
}
