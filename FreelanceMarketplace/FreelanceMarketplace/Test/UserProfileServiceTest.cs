using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace FreelanceMarketplace.Tests.Services
{
    public class UserProfileServiceTest
    {
        private readonly Mock<AppDbContext> _mockContext;
        private readonly IUserProfileService _userProfileService;

        public UserProfileServiceTest()
        {
            // Mock DbSet<UserProfile> and AppDbContext
            var mockUserProfiles = new Mock<DbSet<UserProfile>>();
            _mockContext = new Mock<AppDbContext>();

            _mockContext.Setup(c => c.UserProfiles).Returns(mockUserProfiles.Object);

            _userProfileService = new UserProfileService(_mockContext.Object);
        }

        [Fact]
        public async Task GetUserProfileByIdAsync_ShouldReturnUserProfile_WhenIdIsValid()
        {
            // Arrange
            var userProfile = new UserProfile { Id = 1, UserId = 1, FullName = "John Doe" };
            _mockContext.Setup(x => x.UserProfiles.FindAsync(1)).ReturnsAsync(userProfile);

            // Act
            var result = await _userProfileService.GetUserProfileByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userProfile.Id, result.Id);
        }

        [Fact]
        public async Task GetUserProfileByUserIdAsync_ShouldReturnUserProfile_WhenUserIdExists()
        {
            // Arrange
            var userProfile = new UserProfile { Id = 1, UserId = 1, FullName = "John Doe" };

            _mockContext.Setup(x => x.UserProfiles
                .FirstOrDefaultAsync(u => u.UserId == 1, CancellationToken.None))
                .ReturnsAsync(userProfile);

            // Act
            var result = await _userProfileService.GetUserProfileByUserIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userProfile.UserId, result.UserId);
        }


        [Fact]
        public async Task GetAllUserProfilesAsync_ShouldReturnAllUserProfiles()
        {
            // Arrange
            var userProfiles = new List<UserProfile>
    {
        new UserProfile { Id = 1, UserId = 1, FullName = "John Doe" },
        new UserProfile { Id = 2, UserId = 2, FullName = "Jane Smith" }
    };

            // Chỉnh sửa Setup để cung cấp CancellationToken
            _mockContext.Setup(x => x.UserProfiles.ToListAsync(CancellationToken.None))
                        .ReturnsAsync(userProfiles);

            // Act
            var result = await _userProfileService.GetAllUserProfilesAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }


        [Fact]
        public async Task CreateUserProfileAsync_ShouldReturnCreatedUserProfile()
        {
            // Arrange
            var userProfile = new UserProfile { UserId = 1, FullName = "John Doe" };

            // Mocking AddAsync method for UserProfiles
            var mockEntityEntry = new Mock<EntityEntry<UserProfile>>();  // Mock the EntityEntry
            _mockContext.Setup(x => x.UserProfiles.AddAsync(userProfile, default))
                        .ReturnsAsync(mockEntityEntry.Object);  // Return the mocked EntityEntry

            // Mock SaveChangesAsync to return a successful result
            _mockContext.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1); // Simulating successful save

            // Act
            var result = await _userProfileService.CreateUserProfileAsync(userProfile);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userProfile.UserId, result.UserId);
        }


        [Fact]
        public async Task UpdateUserProfileAsync_ShouldReturnUpdatedUserProfile()
        {
            // Arrange
            var userProfile = new UserProfile { Id = 1, UserId = 1, FullName = "John Doe" };
            _mockContext.Setup(x => x.Entry(userProfile).State).Returns(EntityState.Modified);
            _mockContext.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _userProfileService.UpdateUserProfileAsync(userProfile);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userProfile.FullName, result.FullName);
        }

        [Fact]
        public async Task DeleteUserProfileAsync_ShouldReturnTrue_WhenProfileExists()
        {
            // Arrange
            var userProfile = new UserProfile { Id = 1, UserId = 1, FullName = "John Doe" };
            _mockContext.Setup(x => x.UserProfiles.FindAsync(1)).ReturnsAsync(userProfile);
            _mockContext.Setup(x => x.UserProfiles.Remove(userProfile));
            _mockContext.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _userProfileService.DeleteUserProfileAsync(1);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteUserProfileAsync_ShouldReturnFalse_WhenProfileNotFound()
        {
            // Arrange
            _mockContext.Setup(x => x.UserProfiles.FindAsync(1)).ReturnsAsync((UserProfile)null);

            // Act
            var result = await _userProfileService.DeleteUserProfileAsync(1);

            // Assert
            Assert.False(result);
        }
    }
}
