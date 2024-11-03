using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Services
{
    public class UserProfileService : IUserProfileService
    {
        private readonly AppDbContext _context;

        public UserProfileService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfile> GetUserProfileByIdAsync(int id)
        {
            return await _context.UserProfiles.FindAsync(id);
        }

        public async Task<UserProfile> GetUserProfileByUserIdAsync(int userId)
        {
            return await _context.UserProfiles.FirstOrDefaultAsync(up => up.UserId == userId);
        }

        public async Task<IEnumerable<UserProfile>> GetAllUserProfilesAsync()
        {
            return await _context.UserProfiles.ToListAsync();
        }

        public async Task<UserProfile> CreateUserProfileAsync(UserProfile userProfile)
        {
            _context.UserProfiles.Add(userProfile);
            await _context.SaveChangesAsync();
            return userProfile;
        }

        public async Task<UserProfile> UpdateUserProfileAsync(UserProfile userProfile)
        {
            _context.Entry(userProfile).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return userProfile;
        }

        public async Task<bool> DeleteUserProfileAsync(int id)
        {
            var userProfile = await _context.UserProfiles.FindAsync(id);
            if (userProfile == null)
                return false;

            _context.UserProfiles.Remove(userProfile);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
