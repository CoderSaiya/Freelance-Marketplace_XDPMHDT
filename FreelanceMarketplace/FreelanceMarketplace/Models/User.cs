using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Contracts;

namespace FreelanceMarketplace.Models
{
    [Table("Users")]
    public class Users
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string? Username { get; set; }
        [Required]
        [MaxLength(250)]
        public string? PasswordHash { get; set; }
        [Required]
        public string? Email { get; set; }
        public string? Role { get; set; } = "Client";
        public bool IsEmailConfirmed { get; set; } = false;
        public string? EmailConfirmationToken { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public ICollection<RefreshTokens> RefreshTokens { get; set; } = new List<RefreshTokens>();
        public ICollection<Contracts> FreelancerContracts { get; set; } = new List<Contracts>();
        public ICollection<Contracts> ClientContracts { get; set; } = new List<Contracts>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public UserProfile? UserProfile { get; set; }
        public ICollection<Apply> Applies { get; set; } = new List<Apply>();
        public ICollection<Img> UploadedImages { get; set; } = new List<Img>();
        public Wallet? Wallet { get; set; }
        public ICollection<Project> Projects { get; set; } = new List<Project>();
        public ICollection<Notification> SenderNotification { get; set; } = new List<Notification>();
        public ICollection<Notification> RecipientNotification { get; set; } = new List<Notification>();
    }
}
