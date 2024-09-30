namespace FreelanceMarketplace.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string? Message { get; set; }
        public bool? IsRead { get; set; } = false;
        public DateTime? Created { get; set; }

        public ICollection<Users>? User { get; set; }
    }
}
