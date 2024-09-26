using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs.Req;
using FreelanceMarketplace.Models.DTOs.Res;
using FreelanceMarketplace.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

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

        public async Task<Response> RegisterUserAsync(RegisterReq registerReq)
        {
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == registerReq.Username);
            if (existingUser != null)
            {
                return new Response
                {
                    Success = false,
                    Message = "Username is already taken."
                };
            }

            var user = new Users
            {
                Username = registerReq.Username,
                Role = registerReq.Role
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, registerReq.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new Response
            {
                Success = true,
                Message = "User registered successfully."
            };
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

        public void RegisterUser(string username, string password)
        {
            var user = new Users
            {
                Username = username,
                PasswordHash = CreatePasswordHash(password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();
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

        public RefreshTokens? GetRefreshTokenByToken(string token)
        {
            return _context.RefreshTokens
                .SingleOrDefault(rt => rt.Token == token);
        }

        public void MarkRefreshTokenAsUsed(RefreshTokens refreshToken)
        {
            refreshToken.IsUsed = true;
            _context.RefreshTokens.Update(refreshToken);
            _context.SaveChanges();
        }

        public string CreatePasswordHash(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }

        public Users GetUserById(int userId)
        {
#pragma warning disable CS8603 // Possible null reference return.
            return _context.Users.Find(userId);
#pragma warning restore CS8603 // Possible null reference return.
        }

        public Users GetUserByUsername(string username)
        {
            return _context.Users.SingleOrDefault(u => u.Username == username);
        }
    }
}
