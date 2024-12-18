using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FreelanceMarketplace.Models
{
    public class Apply
    {
        [Key]
        public int ApplyId { get; set; }

        [Required]
        public int FreelancerId { get; set; }

        [ForeignKey("FreelancerId")]
        public Users? Freelancer { get; set; }

        [Required]
        public int ClientId { get; set; }

        [ForeignKey("ClientId")]
        public Users? Client { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project? Project { get; set; }

        public int Duration { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreateAt { get; set; } = DateTime.Now;
    }
}
