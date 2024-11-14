//using FreelanceMarketplace.Data;
//using FreelanceMarketplace.Models;
//using FreelanceMarketplace.Services;
//using FreelanceMarketplace.Services.Interfaces;
//using Microsoft.EntityFrameworkCore;
//using Moq;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Xunit;

//namespace FreelanceMarketplace.Tests
//{
//    public class ReviewServiceTests
//    {
//        private readonly DbContextOptions<AppDbContext> _dbContextOptions;
//        private readonly Mock<INotificationService> _mockNotificationService;

//        public ReviewServiceTests()
//        {
//            _dbContextOptions = new DbContextOptionsBuilder<AppDbContext>()
//                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
//                .Options;
//            _mockNotificationService = new Mock<INotificationService>();
//        }

//        private AppDbContext CreateDbContext()
//        {
//            var context = new AppDbContext(_dbContextOptions);
//            context.Database.EnsureCreated(); // Tạo database trong bộ nhớ trong nếu chưa tồn tại
//            return context;
//        }

//        [Fact]
//        public async Task GetAllReviewsAsync_ShouldReturnReviews()
//        {
//            // Arrange

//            using (var context = CreateDbContext())
//            {
//                context.Database.EnsureDeleted();  // Clear the database state before test
//                context.Database.EnsureCreated();  // Recreate the in-memory database
//                context.Reviews.AddRange(new List<Review>
//                {
//                    new Review { ReviewId = 1, Rating = 4 },
//                    new Review { ReviewId = 2, Rating = 3 }
//                });
//                await context.SaveChangesAsync();
//                Console.WriteLine($"Review count after saving: {context.Reviews.Count()}");  // Verify the reviews are saved


//                var reviewService = new ReviewService(context, _mockNotificationService.Object);

//                // Act
//                var result = await reviewService.GetAllReviewsAsync();

//                // Assert
//                Assert.Equal(2, result.Count);
//            }
//        }

//        [Fact]
//        public async Task GetReviewByIdAsync_ReviewExists_ShouldReturnReview()
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var review = new Review { ReviewId = 1, Rating = 4, UserId = 1, ContractId = 1 };
//                context.Reviews.Add(review);
//                await context.SaveChangesAsync();  // Ensure review is saved

//                // Check if the review was actually saved
//                var savedReview = await context.Reviews.FindAsync(1);  // Find the review with ID 1
//                Assert.NotNull(savedReview);  // Ensure the review exists in the database
//                Assert.Equal(1, savedReview.ReviewId);  // Assert correct ID

//                var reviewService = new ReviewService(context, _mockNotificationService.Object);

//                // Act
//                var result = await reviewService.GetReviewByIdAsync(1);  // Request the review with ReviewId = 1

//                // Assert
//                Assert.NotNull(result);  // Ensure the review is found
//                Assert.Equal(1, result.ReviewId);  // Assert that the correct review ID is returned
//            }

//        }




//        [Fact]
//        public async Task CreateReviewAsync_ShouldAddReviewAndSendNotification()
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var review = new Review { ReviewId = 1, Rating = 4, UserId = 1 };
//                var reviewService = new ReviewService(context, _mockNotificationService.Object);

//                // Act
//                var result = await reviewService.CreateReviewAsync(review);

//                // Assert
//                Assert.Equal(4, result.Rating);
//                _mockNotificationService.Verify(n => n.CreateNotificationAsync(It.IsAny<Notification>()), Times.Once);
//            }
//        }

//        [Fact]
//        public async Task UpdateReviewAsync_ReviewExists_ShouldUpdateReviewAndSendNotification()
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var existingReview = new Review { ReviewId = 1, Rating = 3 };
//                context.Reviews.Add(existingReview);
//                await context.SaveChangesAsync();

//                var updatedReview = new Review { ReviewId = 1, Rating = 4, UserId = 1, ContractId = 2 };
//                var reviewService = new ReviewService(context, _mockNotificationService.Object);

//                // Act
//                var result = await reviewService.UpdateReviewAsync(1, updatedReview);

//                // Assert
//                Assert.Equal(4, result.Rating);
//                _mockNotificationService.Verify(n => n.CreateNotificationAsync(It.IsAny<Notification>()), Times.Once);
//            }
//        }

//        [Fact]
//        public async Task DeleteReviewAsync_ReviewExists_ShouldDeleteReview()
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var review = new Review { ReviewId = 1, Rating = 4 };
//                context.Reviews.Add(review);
//                await context.SaveChangesAsync();

//                var reviewService = new ReviewService(context, _mockNotificationService.Object);

//                // Act
//                var result = await reviewService.DeleteReviewAsync(1);

//                // Assert
//                Assert.True(result);
//                Assert.Empty(context.Reviews);
//            }
//        }

//        [Theory]
//        [InlineData(4.5, "Tốt")]
//        [InlineData(3.5, "Trung bình")]
//        [InlineData(2.0, "Kém")]
//        public void GetRatingStatus_ShouldReturnCorrectStatus(double rating, string expectedStatus)
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var reviewService = new ReviewService(context, _mockNotificationService.Object);

//                // Act
//                var result = reviewService.GetRatingStatus(rating);

//                // Assert
//                Assert.Equal(expectedStatus, result);
//            }
//        }
//    }
//}
