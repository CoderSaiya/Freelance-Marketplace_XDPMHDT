using System.Security.Claims;

namespace FreelanceMarketplace.Services.Interface
{
    public interface IAuthService
    {
        string Login(string username, string password);
        string RefreshToken(string refreshToken);
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
    }
}
