using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IReviewService
    {

        Task<List<Review>> GetAllReviewsAsync();
        Task<Review> GetReviewByIdAsync(int reviewId);

        Task<Review> CreateReviewAsync(Review review);

        Task<Review?> UpdateReviewAsync(int reviewId, Review review);

        Task<bool> DeleteReviewAsync(int reviewId);
        Task<List<Review>> GetReviewsSortedByRatingAsync(bool ascending = false);
    }
}
