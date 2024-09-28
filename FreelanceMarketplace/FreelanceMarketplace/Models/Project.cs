using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreelanceMarketplace.Models
{
    [Table("Project")]
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }

        [Required]
        [MaxLength(200)]
        public string? ProjectName { get; set; }

        [Required]
        [MaxLength(1000)]
        public string? ProjectDescription { get; set; }

        [Required]
        public double Budget { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        public string? SkillRequire { get; set; }

        [Required]
        public string? Status { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        [Required]
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }



    }
}
