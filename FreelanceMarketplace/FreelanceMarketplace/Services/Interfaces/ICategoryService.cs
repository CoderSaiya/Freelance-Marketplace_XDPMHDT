using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<List<Category>> GetAllCategoriesAsync();
        Task<Category?> GetCategoryByIdAsync(int categoryId);
        Task<Category> CreateCategoryAsync(Category category);
        Task<Category> UpdateCategoryAsync(int categoryId, Category Category);
        Task<bool> DeleteCategoryAsync(int categoryId);
        Task<List<Project>> GetProjectsSortedByCategoryPriorityAsync();
        Task<List<CategoryPercentageDto>> GetCategoryPercentagesAsync();

    }
}
