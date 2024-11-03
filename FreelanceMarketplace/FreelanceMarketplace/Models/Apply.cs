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
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public Users? User { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project? Project { get; set; }
        public int Duration { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreateAt { get; set; } = DateTime.Now;
    }
}
