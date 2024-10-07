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
        [ForeignKey("UserId")]
        public int UserId { get; set; }

        [Required]
        [ForeignKey("ContractId")]
        public  int ContractId { get; set; }
        [Required]
        public int Rating { get; set; }
        public String? Feedback { get; set; }

        public Users? User { get; set; }    

        public Contracts? Contract { get; set; }


        




    }
}
