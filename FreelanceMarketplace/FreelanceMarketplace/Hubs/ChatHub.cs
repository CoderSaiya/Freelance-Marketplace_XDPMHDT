using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Hubs
{
    public class ChatHub:Hub
    {
        private readonly IUserService _userService;
        private readonly AuthDbContext _context;
        public ChatHub(IUserService userService, AuthDbContext context)
        {
            _userService = userService;
            _context = context;
        }
        public async Task SendMessage(string user, string message)
        {
            var chatMessage = new ChatMessage { UserId = _userService.GetUserByUsername(user).Id, Message = message };
            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
