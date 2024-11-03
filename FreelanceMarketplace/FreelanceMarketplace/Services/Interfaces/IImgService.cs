using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IImgService
    {
        Task<IEnumerable<Img>> GetAllImagesAsync();
        Task<Img> GetImageByIdAsync(int id);
        Task<Img> CreateImageAsync(IFormFile file, int projectId, int userId, string imageUrl);
        Task<Img> UpdateImageAsync(Img img);
        Task<bool> DeleteImageAsync(int id);
    }
}
