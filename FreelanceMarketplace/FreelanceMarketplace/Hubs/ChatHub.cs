using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IUserService _userService;
        private readonly AppDbContext _context;
        public ChatHub(IUserService userService, AppDbContext context)
        {
            _userService = userService;
            _context = context;
        }
        public async Task SendMessage(string sender, string recipient, string message)
        {
            var senderId = _userService.GetUserByUsername(sender)?.Id;
            var recipientId = _userService.GetUserByUsername(recipient)?.Id;
            if (senderId == null || recipientId == null) return;

            var chatMessage = new ChatMessage
            {
                SenderId = senderId,
                RecipientId = recipientId,
                Message = message,
                Timestamp = DateTime.UtcNow
            };

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            // Send message to only involved users
            await Clients.User(senderId.ToString()).SendAsync("ReceiveMessage", sender, message);
            await Clients.User(recipientId.ToString()).SendAsync("ReceiveMessage", sender, message);
        }

    }
}
