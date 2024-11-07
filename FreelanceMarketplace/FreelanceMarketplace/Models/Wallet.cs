using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreelanceMarketplace.Models
{
    [Table("Wallet")]
    public class Wallet
    {
        [Key]
        public int WalletId { get; set; }
        [Required]
        [ForeignKey("UserId")]
        public int UserId { get; set; }
        public decimal? Balance { get; set; }
        public Users? User { get; set; }
    }
}
