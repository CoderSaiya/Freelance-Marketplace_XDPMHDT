using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreelanceMarketplace.Models
{
    [Table("Category")]
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(200)]
        public string? CategoryName { get; set; }

        [MaxLength(200)]
        public string? CategoryDescription { get; set; }

        public ICollection<Project> Projects { get; set; } = new List<Project>();

    }
}
