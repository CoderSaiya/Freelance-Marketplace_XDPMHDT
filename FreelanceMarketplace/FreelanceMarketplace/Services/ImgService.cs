using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Services
{
    public class ImgService : IImgService
    {
        private readonly AppDbContext _context;

        public ImgService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Img>> GetAllImagesAsync()
        {
            return await _context.Images.Include(i => i.Project)
                                        .Include(i => i.UploadedByUser)
                                        .ToListAsync();
        }

        public async Task<Img> GetImageByIdAsync(int id)
        {
            var img = await _context.Images.Include(i => i.Project)
                                           .Include(i => i.UploadedByUser)
                                           .FirstOrDefaultAsync(i => i.Id == id);
            if (img == null)
            {
                throw new KeyNotFoundException("Image not found");
            }
            return img;
        }

        public async Task<Img> CreateImageAsync(IFormFile file, int projectId, int userId, string imageUrl)
        {
            var img = new Img
            {
                ImageName = file.FileName,
                ImageUrl = imageUrl,
                MimeType = file.ContentType,
                FileSize = file.Length,
                UploadedDate = DateTime.UtcNow,
                ProjectId = projectId,
                UploadedByUserId = userId
            };

            _context.Images.Add(img);
            await _context.SaveChangesAsync();

            return img;
        }

        public async Task<Img> UpdateImageAsync(Img img)
        {
            var existingImg = await _context.Images.FindAsync(img.Id);
            if (existingImg == null)
            {
                throw new KeyNotFoundException("Image not found");
            }

            existingImg.ImageName = img.ImageName;
            existingImg.ImageUrl = img.ImageUrl;
            existingImg.MimeType = img.MimeType;
            existingImg.FileSize = img.FileSize;
            existingImg.ProjectId = img.ProjectId;
            existingImg.UploadedByUserId = img.UploadedByUserId;
            await _context.SaveChangesAsync();

            return existingImg;
        }

        public async Task<bool> DeleteImageAsync(int id)
        {
            var img = await _context.Images.FindAsync(id);
            if (img == null)
            {
                return false;
            }

            _context.Images.Remove(img);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
