namespace FreelanceMarketplace.Models.DTOs
{
    public class ProjectWithImageDto
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string ProjectDescription { get; set; }
        public double Budget { get; set; }
        public DateTime Deadline { get; set; }
        public string SkillRequire { get; set; }
        public string Status { get; set; }
        public int CategoryId { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
    }
}
