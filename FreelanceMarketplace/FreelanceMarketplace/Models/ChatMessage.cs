using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreelanceMarketplace.Models
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public Users? User { get; set; }
        public string? Message { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
