using System.ComponentModel.DataAnnotations;
using System;


namespace FreelanceMarketplace.Models
{
    public class Img
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string ImageName { get; set; }  

        [Required]
        [MaxLength(2048)]
        public string ImageUrl { get; set; }  

        [MaxLength(255)]
        public string MimeType { get; set; }  

        [Required]
        public DateTime UploadedDate { get; set; }  

        public long FileSize { get; set; }  

        
        public int? ProductId { get; set; }  
        public string UploadedBy { get; set; }  
    }
}
