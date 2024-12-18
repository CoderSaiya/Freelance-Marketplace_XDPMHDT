using System.ComponentModel.DataAnnotations;

namespace FreelanceMarketplace.Models.DTOs.Req
{
    public record TokenDto(string AccessToken, string RefreshToken);
}
