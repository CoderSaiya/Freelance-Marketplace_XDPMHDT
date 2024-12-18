﻿using FreelanceMarketplace.Models.DTOs.Req;
using FreelanceMarketplace.Models.DTOs.Res;
using Google.Apis.Auth.OAuth2.Responses;
using System.Security.Claims;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IAuthService
    {
        TokenDto Login(string username, string password);
        Task<TokenRes> RefreshTokenAsync(string token);
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
        ClaimsPrincipal ValidateToken(string token);
        Task<TokenResponse> ExchangeCodeForTokensAsync(string code);
    }
}
