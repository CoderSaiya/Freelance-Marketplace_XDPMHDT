using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs.Req;
using FreelanceMarketplace.Models.DTOs.Res;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IUserService
    {
        Task<bool> RegisterUserAsync(RegisterReq registerReq);
        Task<bool> ConfirmEmailAsync(int userId, string token);
        Users Authenticate(string username, string password);
        void SaveRefreshToken(int userId, string refreshToken);
        RefreshTokens GetRefreshToken(int userId);
        RefreshTokens GetRefreshTokenByToken(string token);
        void MarkRefreshTokenAsUsed(RefreshTokens refreshToken);
        Task<Users> GetUserById(int userId);
        Task<Users> GetUserByUsername(string username);
        Task<Users> GetUserByUsernameAsync(string username);
        List<Users> GetUsers();
        bool DeleteUserById(int userId);
        Users GetOrCreateUserFromGoogleToken(string googleEmail);
        Task<bool> ForgotPassword(string mail);
    }
}
