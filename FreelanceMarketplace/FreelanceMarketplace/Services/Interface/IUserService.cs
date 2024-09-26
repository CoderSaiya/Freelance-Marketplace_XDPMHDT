using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs.Req;
using FreelanceMarketplace.Models.DTOs.Res;

namespace FreelanceMarketplace.Services.Interface
{
    public interface IUserService
    {
        Task<Response> RegisterUserAsync(RegisterReq registerReq);
        Users Authenticate(string username, string password);
        void RegisterUser(string username, string password);
        void SaveRefreshToken(int userId, string refreshToken);
        RefreshTokens GetRefreshToken(int userId);
        public RefreshTokens? GetRefreshTokenByToken(string token);
        void MarkRefreshTokenAsUsed(RefreshTokens refreshToken);
        public Users GetUserById(int userId);
        public Users GetUserByUsername(string username);
    }
}
