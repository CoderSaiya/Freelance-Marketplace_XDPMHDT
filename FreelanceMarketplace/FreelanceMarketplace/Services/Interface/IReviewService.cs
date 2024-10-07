using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.Services.Interface
{
    public interface IReviewService
    {

        Task<List<Review>> GetAllReviewsAsync();
        Task <Review> GetReviewByIdAsync(int reviewId);

        Task <Review> CreateReviewAsync(Review review);

        Task UpdateReviewAsync(Review review); 

        Task DeleteReviewAsync(int reviewId);
        

    }
}
