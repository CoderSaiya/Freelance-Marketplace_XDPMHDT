using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Http;

namespace FreelanceMarketplace.Tests
{
    public class ImgServiceTests
    {
        private readonly AppDbContext _context;
        private readonly ImgService _imgService;
        private readonly Mock<IFormFile> _mockFile;

        public ImgServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _context = new AppDbContext(options);

            _imgService = new ImgService(_context);

            // Mocking IFormFile
            _mockFile = new Mock<IFormFile>();
            _mockFile.Setup(f => f.FileName).Returns("test-image.jpg");
            _mockFile.Setup(f => f.ContentType).Returns("image/jpeg");
            _mockFile.Setup(f => f.Length).Returns(12345);
            _mockFile.Setup(f => f.OpenReadStream()).Returns(new MemoryStream(new byte[] { 1, 2, 3, 4, 5 }));
        }

        [Fact]
        public async Task GetAllImagesAsync_ShouldReturnAllImages()
        {
            // Arrange
            var image1 = new Img { Id = 1, ImageName = "image1.jpg", ImageUrl = "url1", MimeType = "image/jpeg", FileSize = 12345 };
            var image2 = new Img { Id = 2, ImageName = "image2.jpg", ImageUrl = "url2", MimeType = "image/jpeg", FileSize = 12345 };
            _context.Images.AddRange(image1, image2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _imgService.GetAllImagesAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetImageByIdAsync_ShouldReturnImage_WhenIdExists()
        {
            // Arrange
            var image = new Img { Id = 1, ImageName = "image1.jpg", ImageUrl = "url1", MimeType = "image/jpeg", FileSize = 12345 };
            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            // Act
            var result = await _imgService.GetImageByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("image1.jpg", result.ImageName);
        }

        [Fact]
        public async Task GetImageByIdAsync_ShouldThrowKeyNotFoundException_WhenIdDoesNotExist()
        {
            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await _imgService.GetImageByIdAsync(999));
        }

        [Fact]
        public async Task CreateImageAsync_ShouldAddImageToDatabase()
        {
            // Arrange
            var imageUrl = "http://example.com/image.jpg";
            int projectId = 1, userId = 1;

            // Act
            var result = await _imgService.CreateImageAsync(_mockFile.Object, projectId, userId, imageUrl);

            // Assert
            var savedImage = await _context.Images.FindAsync(result.Id);
            Assert.NotNull(savedImage);
            Assert.Equal("test-image.jpg", savedImage.ImageName);
            Assert.Equal(imageUrl, savedImage.ImageUrl);
            Assert.Equal("image/jpeg", savedImage.MimeType);
            Assert.Equal(12345, savedImage.FileSize);
        }

        [Fact]
        public async Task UpdateImageAsync_ShouldUpdateImageDetails()
        {
            // Arrange
            var image = new Img { Id = 1, ImageName = "image1.jpg", ImageUrl = "url1", MimeType = "image/jpeg", FileSize = 12345 };
            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            // Act
            image.ImageName = "updated-image.jpg";
            image.ImageUrl = "updated-url";
            var result = await _imgService.UpdateImageAsync(image);

            // Assert
            var updatedImage = await _context.Images.FindAsync(result.Id);
            Assert.Equal("updated-image.jpg", updatedImage.ImageName);
            Assert.Equal("updated-url", updatedImage.ImageUrl);
        }

        [Fact]
        public async Task UpdateImageAsync_ShouldThrowKeyNotFoundException_WhenImageDoesNotExist()
        {
            // Act & Assert
            var image = new Img { Id = 999, ImageName = "nonexistent.jpg" };
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await _imgService.UpdateImageAsync(image));
        }

        [Fact]
        public async Task DeleteImageAsync_ShouldRemoveImageFromDatabase()
        {
            // Arrange
            var image = new Img { Id = 1, ImageName = "image1.jpg" };
            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            // Act
            var result = await _imgService.DeleteImageAsync(1);

            // Assert
            var deletedImage = await _context.Images.FindAsync(1);
            Assert.True(result);
            Assert.Null(deletedImage);
        }

        [Fact]
        public async Task DeleteImageAsync_ShouldReturnFalse_WhenImageDoesNotExist()
        {
            // Act & Assert
            var result = await _imgService.DeleteImageAsync(999);
            Assert.False(result);
        }
    }
}
