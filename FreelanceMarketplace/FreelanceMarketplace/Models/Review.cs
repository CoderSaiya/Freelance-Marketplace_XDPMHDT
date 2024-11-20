using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreelanceMarketplace.Models
{
    [Table("Review")]
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }

        [Required]
        public int SenderId { get; set; }
        [Required]
        public int RecipientId { get; set; }

        [Required]
        public int ContractId { get; set; }
        [Required]
        public int Rating { get; set; }
        public string? Feedback { get; set; }

        [ForeignKey("SenderId")]
        public Users? Sender { get; set; }
        [ForeignKey("RecipientId")]
        public Users? Recipient { get; set; }

        [ForeignKey("ContractId")]
        public Contracts? Contract { get; set; }
    }
}
