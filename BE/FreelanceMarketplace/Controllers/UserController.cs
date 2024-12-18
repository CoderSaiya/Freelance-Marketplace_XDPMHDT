using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs.Req;
using FreelanceMarketplace.Models.DTOs.Res;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FreelanceMarketplace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet]
        public IActionResult GetAllUser()
        {
            List<Users> users = (List<Users>)_userService.GetUsers();
            if (users == null)
            {
                return Ok(new Response<List<Users>>
                {
                    Success = false,
                    Message = "No users found.",
                    Data = null
                });
            }
            return Ok(new Response<List<Users>>
            {
                Success = true,
                Message = "Users retrieved successfully.",
                Data = users
            });
        }
    }
}
