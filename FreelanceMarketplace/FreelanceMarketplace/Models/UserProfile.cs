using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FreelanceMarketplace.Models
{
    public class UserProfile
    {
        [Key]
        public int Id { get; set; }
        public float Rating { get; set; }
        public string? Company { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public string? Skill { get; set; }
        public string? Avatar { get; set; }
        public string? Industry { get; set; }
        public int UserId { get; set; }
        public string Status = "Active";
        [ForeignKey("UserId")]
        public Users? User { get; set; }
    }
}
