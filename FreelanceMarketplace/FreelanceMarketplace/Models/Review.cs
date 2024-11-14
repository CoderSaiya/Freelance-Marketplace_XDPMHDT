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
        public int UserId { get; set; }

        [Required]
        public int ContractId { get; set; }
        [Required]
        public int Rating { get; set; }
        public String? Feedback { get; set; }

        [ForeignKey("UserId")]
        public Users? User { get; set; }

        [ForeignKey("ContractId")]
        public Contracts? Contract { get; set; }
    }
}
