using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs.Req;
using FreelanceMarketplace.Models.DTOs.Res;

namespace FreelanceMarketplace.Services.Interface
{
    public interface IUserService
    {
        Task<bool> RegisterUserAsync(RegisterReq registerReq);
        Users Authenticate(string username, string password);
        void SaveRefreshToken(int userId, string refreshToken);
        RefreshTokens GetRefreshToken(int userId);
        RefreshTokens GetRefreshTokenByToken(string token);
        void MarkRefreshTokenAsUsed(RefreshTokens refreshToken);
        Users GetUserById(int userId);
        Users GetUserByUsername(string username);
    }
}
