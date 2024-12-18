using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreelanceMarketplace.Models
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int? SenderId { get; set; }
        [Required]
        public int? RecipientId { get; set; }
        [ForeignKey("SenderId")]
        public Users? Sender { get; set; }
        [ForeignKey("RecipientId")]
        public Users? Recipient { get; set; }
        public string? Message { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
