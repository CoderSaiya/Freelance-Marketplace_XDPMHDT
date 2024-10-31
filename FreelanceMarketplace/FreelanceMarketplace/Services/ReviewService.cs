using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using Google.Apis.Drive.v3.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FreelanceMarketplace.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public ReviewService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<List<Review>> GetAllReviewsAsync()
        {
            try
            {
                return await _context.Reviews
                    .Include(c => c.User)
                    .Include(c => c.Contract)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving reviews", ex);

            }
        }

        public async Task<Review> GetReviewByIdAsync(int reviewId)
        {
            try
            {
                var review = await _context.Reviews
                    .Include(c => c.User)
                    .Include(c => c.Contract)
                    .FirstOrDefaultAsync();

                if (review == null)
                    throw new KeyNotFoundException("Review not found");
                return review;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving review with ID {reviewId}", ex);
            }

        }

        public async Task<Review> CreateReviewAsync(Review review)
        {
            try
            {
                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();
                await _notificationService.CreateNotificationAsync(new Notification
                {
                    UserId = review.UserId,
                    Message = $"You have received a new review {review.Rating} ({GetRatingStatus(review.Rating)}",
                    CreatedAt = DateTime.UtcNow
                });
                return review;
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating review", ex);
            }
        }

        public async Task<Review?> UpdateReviewAsync(int reviewId, Review review)
        {
            try
            {
                var existingReview = await _context.Reviews.FindAsync(review.ReviewId);
                if (existingReview == null)
                {
                    throw new KeyNotFoundException("Review not found");
                }

                existingReview.UserId = review.UserId;
                existingReview.ContractId = review.ContractId;
                existingReview.Rating = review.Rating;
                existingReview.Feedback = review.Feedback;

                _context.Reviews.Update(existingReview);
                await _context.SaveChangesAsync();
                await _notificationService.CreateNotificationAsync(new Notification
                {
                    UserId = review.UserId,
                    Message = $"Review have been updated {review.Rating} ({GetRatingStatus(review.Rating)}",
                    CreatedAt = DateTime.UtcNow
                });

                return existingReview;
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating review", ex);
            }
        }

        public async Task<bool> DeleteReviewAsync(int reviewId)
        {
            try
            {
                var review = await _context.Reviews.FindAsync(reviewId);
                if (review == null)
                {
                    throw new KeyNotFoundException("Review not found");
                }
                _context.Reviews.Remove(review);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting review", ex);
            }
        }

        //public async Task<List<Users>> GetUsersRankedByRatingAsync()
        //{
        //    var rankUsers = await _context.Users
        //        .Include(u => u.Reviews) // Include reviews for calculating average rating
        //        .OrderByDescending(u => u.Reviews.Average(r => r.Rating)) // Order by average rating descending
        //        .ToListAsync();
        //    return rankUsers;
        //}
        public async Task<List<Review>> GetReviewsSortedByRatingAsync(bool ascending = false)
        {
            try
            {
                var query = _context.Reviews
                    .Include(c => c.User)  // Bao gồm thông tin người dùng đã đánh giá
                    .Include(c => c.Contract);  // Bao gồm thông tin hợp đồng liên quan

                if (ascending)
                {
                    return await query.OrderBy(r => r.Rating).ToListAsync();  // Sắp xếp theo thứ tự tăng dần
                }
                else
                {
                    return await query.OrderByDescending(r => r.Rating).ToListAsync();  // Sắp xếp theo thứ tự giảm dần
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving sorted reviews", ex);
            }
        }
        public string GetRatingStatus(double rating)
        {
            if (rating >= 4)
            {
                return "Tốt";
            }
            else if (rating >= 3 && rating < 4)
            {
                return "Trung bình";
            }
            else
            {
                return "Kém";
            }
        }


    }


}
