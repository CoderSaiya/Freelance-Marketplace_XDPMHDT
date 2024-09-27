using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs.Req;
using FreelanceMarketplace.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Services
{
    public class UserService : IUserService
    {
        private readonly AuthDbContext _context;
        private readonly PasswordHasher<Users> _passwordHasher;

        public UserService(AuthDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<Users>();
        }

        public async Task<bool> RegisterUserAsync(RegisterReq registerReq)
        {
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == registerReq.Username);
            if (existingUser != null)
            {
                return false;
            }

            var user = new Users
            {
                Username = registerReq.Username,
                Role = registerReq.Role
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, registerReq.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public Users Authenticate(string username, string password)
        {
            var user = _context.Users.SingleOrDefault(x => x.Username == username);
            if (user == null)
                return null;

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Success)
                return user;

            return null;
        }

        public void SaveRefreshToken(int userId, string refreshToken)
        {
            var token = new RefreshTokens
            {
                UserId = userId,
                Token = refreshToken,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                IsUsed = false,
                IsRevoked = false
            };

            _context.RefreshTokens.Add(token);
            _context.SaveChanges();
        }

        public RefreshTokens GetRefreshToken(int userId)
        {
#pragma warning disable CS8603 // Possible null reference return.
            return _context.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked && !rt.IsUsed)
                .OrderByDescending(rt => rt.ExpiryDate)
                .FirstOrDefault();
#pragma warning restore CS8603 // Possible null reference return.
        }

        public RefreshTokens GetRefreshTokenByToken(string token)
        {
            return _context.RefreshTokens.SingleOrDefault(rt => rt.Token == token);
        }

        public void MarkRefreshTokenAsUsed(RefreshTokens refreshToken)
        {
            refreshToken.IsUsed = true;
            _context.RefreshTokens.Update(refreshToken);
            _context.SaveChanges();
        }

        public Users GetUserById(int userId)
        {
            return _context.Users.Find(userId);
        }

        public Users GetUserByUsername(string username)
        {
            return _context.Users.SingleOrDefault(u => u.Username == username);
        }
        public List<Users> GetUsers()
        {
            return _context.Users.ToList();
        }
    }
}
