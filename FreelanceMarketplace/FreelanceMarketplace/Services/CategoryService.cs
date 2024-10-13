using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            try
            {
                return await _context.Categories
                    .Include(c => c.Projects)
                    .ToListAsync(); 
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving categories", ex);
            }
        }

        public async Task<Category?> GetCategoryByIdAsync(int categoryId)
        {
            try
            {
                var category = await _context.Categories
                    .Include(c => c.Projects) 
                    .FirstOrDefaultAsync(c => c.CategoryId == categoryId);

                if (category == null)
                    throw new KeyNotFoundException("Category not found");

                return category;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving category with ID {categoryId}", ex);
            }
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return category;
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating category", ex);
            }
        }

        public async Task<Category> UpdateCategoryAsync(int categoryId, Category Category) 
        {
            try
            {
                var existingCategory = await _context.Categories.FindAsync(categoryId);
                if (existingCategory == null)
                    throw new KeyNotFoundException("Category not found");

                existingCategory.CategoryName = Category.CategoryName;
                existingCategory.CategoryDescription = Category.CategoryDescription;

                _context.Categories.Update(existingCategory); 
                await _context.SaveChangesAsync(); 
                return existingCategory; 
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating category", ex);
            }
        }

        public async Task<bool> DeleteCategoryAsync(int categoryId) 
        {
            try
            {
                var category = await _context.Categories.FindAsync(categoryId); 
                if (category == null)
                    throw new KeyNotFoundException("Category not found");

                _context.Categories.Remove(category); 
                await _context.SaveChangesAsync(); 
                return true; 
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting category", ex);
            }
        }
    }
}