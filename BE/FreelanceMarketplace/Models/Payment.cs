using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FreelanceMarketplace.Models


{
    [Table("Payment")]
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }
        [Required]
        [ForeignKey("ContractId")]
        public int? ContractId { get; set; }

        [Required]
        [ForeignKey("UserId")]
        public int UserId { get; set; }

        [Required]
        public int? Amount { get; set; }
        [Required]

        [MaxLength(200)]
        public String? Description { get; set; }

        [Required]
        [MaxLength(200)]
        public String Status { get; set; } = "Pending";

        public Contracts? Contract { get; set; }

        public Users? Users { get; set; }
    }
}
