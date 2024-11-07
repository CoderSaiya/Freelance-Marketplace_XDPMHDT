using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FreelanceMarketplace.Models.DTOs.Res;

namespace FreelanceMarketplace.Services
{
    using FreelanceMarketplace.Models.DTOs.Req;
    using FreelanceMarketplace.Services.Interfaces;
    using Google.Apis.Auth.OAuth2.Responses;
    using Microsoft.Extensions.Configuration;
    using Microsoft.IdentityModel.Tokens;
    using Newtonsoft.Json;
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

        public TokenDto Login(string username, string password)
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

            return new TokenDto(accessToken, refreshToken);
        }

        public TokenRes RefreshToken(string token)
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

            return new TokenRes(newAccessToken, newRefreshToken);
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

        public ClaimsPrincipal ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _config["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _config["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);
                return principal;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<TokenResponse> ExchangeCodeForTokensAsync(string code)
        {
            var httpClient = new HttpClient();
            var tokenRequest = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("client_id", "838128278169-ug2l134id0g6krlkhiklt8u606iln46u.apps.googleusercontent.com"),
                new KeyValuePair<string, string>("client_secret", "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"),
                new KeyValuePair<string, string>("redirect_uri", "https://localhost:7115/api/Auth/google-callback"),
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
            });

            var response = await httpClient.PostAsync("https://oauth2.googleapis.com/token", tokenRequest);
            var responseString = await response.Content.ReadAsStringAsync();

            var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(responseString);
            return tokenResponse;
        }
    }
}
