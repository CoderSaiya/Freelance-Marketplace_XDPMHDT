using System;
using System.ComponentModel.DataAnnotations;

namespace FreelanceMarketplace.Models
{
    public class Apply
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }
        [Required]
        public int FreelancerId { get; set; }  
        [Required]
        [MaxLength(500)]
        public string CoverLetter { get; set; }  

        [Required]
        public DateTime ApplyDate { get; set; }  

        public bool IsAccepted { get; set; }  

        public DateTime? DecisionDate { get; set; }  

        
        public string Remarks { get; set; }  
    }
}
