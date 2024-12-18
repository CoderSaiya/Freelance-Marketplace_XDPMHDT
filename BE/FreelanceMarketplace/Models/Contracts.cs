using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FreelanceMarketplace.Models
{
    [Table("Contract")]
    public class Contracts
    {
        [Key]
        public int ContractId { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project? Project { get; set; }

        [Required]
        public int FreelancerId { get; set; }

        [ForeignKey("FreelancerId")]
        public Users? Freelancer { get; set; }

        [Required]
        public int ClientId { get; set; }

        [ForeignKey("ClientId")]
        public Users? Client { get; set; }

        public DateTime ContractDate { get; set; } = DateTime.Now;
        public DateTime EndDate { get; set; }

        [Required]
        public double PaymentAmount { get; set; }

        [MaxLength(1000)]
        public string Status { get; set; } = "Pending";
        public string? FilePath { get; set; }
        public Payment? Payment { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
