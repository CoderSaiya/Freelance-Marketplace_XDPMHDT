namespace FreelanceMarketplace.Models.DTOs
{
    public class CategoryPercentageDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public int ProjectCount { get; set; }
        public double Percentage { get; set; }
    }
}
