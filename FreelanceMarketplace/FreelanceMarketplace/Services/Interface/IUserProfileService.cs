using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.Services.Interface
{
    public interface IUserProfileService
    {
        Task<UserProfile> GetUserProfileByIdAsync(int id);
        Task<UserProfile> GetUserProfileByUserIdAsync(int userId);
        Task<IEnumerable<UserProfile>> GetAllUserProfilesAsync();
        Task<UserProfile> CreateUserProfileAsync(UserProfile userProfile);
        Task<UserProfile> UpdateUserProfileAsync(UserProfile userProfile);
        Task<bool> DeleteUserProfileAsync(int id);

    }
}
