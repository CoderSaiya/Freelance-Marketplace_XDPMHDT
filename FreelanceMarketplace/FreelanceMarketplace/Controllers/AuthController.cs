using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs.Req;
using FreelanceMarketplace.Services;
using FreelanceMarketplace.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/admin/[controller]")]
public class AuthController : Controller
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;
    private readonly AuthDbContext _context;
    private readonly PasswordHasher<Users> _passwordHasher;

    public AuthController(IAuthService authService, IUserService userService, AuthDbContext context)
    {
        _authService = authService;
        _userService = userService;
        _context = context;
        _passwordHasher = new PasswordHasher<Users>();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterReq registerReq)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _userService.RegisterUserAsync(registerReq);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }

    [HttpPost("login")]
    public JsonResult Login([FromBody] LoginReq request)
    {
        string accessToken = _authService.Login(request.Username, request.Password);
        if (accessToken == null)
            return new JsonResult(Unauthorized());

        Users user = _userService.GetUserByUsername(request.Username);
        string refreshToken = _authService.GenerateRefreshToken();
        _userService.SaveRefreshToken(user.Id, refreshToken);

        return new JsonResult(Ok(new
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        }));
    }

    [HttpPost("refresh-token")]
    public JsonResult RefreshToken([FromBody] TokenDto request)
    {
        var newAccessToken = _authService.RefreshToken(request.RefreshToken);
        if (newAccessToken == null)
            return new JsonResult(Unauthorized());

        return new JsonResult(Ok(new { AccessToken = newAccessToken }));
    }
}
