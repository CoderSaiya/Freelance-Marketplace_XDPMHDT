using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services;
using FreelanceMarketplace.Services.Interface;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Hubs
{
    public class ChatHub:Hub
    {
        private readonly IUserService _userService;
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public ChatHub(IUserService userService, AppDbContext context, INotificationService notificationService)
        {
            _userService = userService;
            _context = context;
            _notificationService = notificationService;
        }
        public async Task SendMessage(string user, string message)
        {
            var chatMessage = new ChatMessage { UserId = _userService.GetUserByUsername(user).Id, Message = message };
            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        public async Task SendNotification(string userId, string message)
        {
            await Clients.User(userId).SendAsync("ReceiveNotification", message);
        }
    }
}
