using FreelanceMarketplace.Models.DTOs.Req;
using System.Security.Claims;

namespace FreelanceMarketplace.Services.Interface
{
    public interface IAuthService
    {
        TokenDto Login(string username, string password);
        string RefreshToken(string refreshToken);
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
    }
}
