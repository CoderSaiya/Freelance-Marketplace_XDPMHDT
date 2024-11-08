using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;


namespace FreelanceMarketplace.Models
{
    public class Img
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string? ImageName { get; set; }  

        [Required]
        [MaxLength(2048)]
        public string? ImageUrl { get; set; }  

        [MaxLength(255)]
        public string? MimeType { get; set; }

        [Required]
        public DateTime UploadedDate { get; set; } = DateTime.UtcNow;

        public long FileSize { get; set; }
        public int ProjectId { get; set; }
        [ForeignKey("ProjectId")]
        public Project? Project { get; set; }
        [Required]
        public int UploadedByUserId { get; set; }
        [ForeignKey("UploadedByUserId")]
        public Users? UploadedByUser { get; set; }
    }
}
