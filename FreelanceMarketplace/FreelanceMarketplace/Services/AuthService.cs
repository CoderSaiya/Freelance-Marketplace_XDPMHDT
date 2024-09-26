using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FreelanceMarketplace.Services
{
    using FreelanceMarketplace.Services.Interface;
    using Microsoft.Extensions.Configuration;
    using Microsoft.IdentityModel.Tokens;
    using System;
    using System.Collections.Generic;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;

    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly IUserService _userService;

        public AuthService(IConfiguration config, IUserService userService)
        {
            _config = config;
            _userService = userService;
        }

        public string Login(string username, string password)
        {
            var user = _userService.Authenticate(username, password);
            if (user == null) return null;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var accessToken = GenerateAccessToken(claims);
            var refreshToken = GenerateRefreshToken();
            _userService.SaveRefreshToken(user.Id, refreshToken);

            return accessToken;
        }

        public string RefreshToken(string token)
        {
            var refreshToken = _userService.GetRefreshTokenByToken(token);
            if (refreshToken == null || refreshToken.ExpiryDate < DateTime.UtcNow || refreshToken.IsUsed || refreshToken.IsRevoked)
            {
                return null;
            }

            _userService.MarkRefreshTokenAsUsed(refreshToken);

            var user = _userService.GetUserById(refreshToken.UserId);
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role)
        };

            var newAccessToken = GenerateAccessToken(claims);
            var newRefreshToken = GenerateRefreshToken();

            // save new token
            _userService.SaveRefreshToken(user.Id, newRefreshToken);

            return newAccessToken;
        }

        public string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }
}
