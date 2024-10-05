using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FreelanceMarketplace.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;

            public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Review>> GetAllReviewsAsync()
        {
            try
            {
                return await _context.Reviews
                    .Include(c => c.User)
                    .Include(c =>c.Contract)
                    .ToListAsync();
            }
            catch(Exception ex)
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
            catch(Exception ex)
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
                return review;
            }
            catch(Exception ex)
            {
                throw new Exception("Error creating review", ex);
            }
        }

        public async Task UpdateReviewAsync(Review review)
        {
            try
            {
                var existingReview = await _context.Reviews.FindAsync(review.ReviewId);
                if (existingReview == null)
                {
                    throw new KeyNotFoundException("Review not found");
                }
                
                existingReview.UserId= review.UserId;
                existingReview.ContractId= review.ContractId;
                existingReview.Rating= review.Rating;
                existingReview.Feedback= review.Feedback;
                
                _context.Reviews.Update(existingReview);
                await _context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw new Exception("Error updating review", ex);
            }
        }

        public async Task  DeleteReviewAsync(int reviewId)
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
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting review", ex);
            }
        }
        
    }
}
