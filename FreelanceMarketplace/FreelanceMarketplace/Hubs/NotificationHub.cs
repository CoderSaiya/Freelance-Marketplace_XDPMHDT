
using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Hubs
{
    public class NotificationHub : Hub
    {
        private readonly INotificationService _notificationService;
        private readonly IUserService _userService;
        private readonly AppDbContext _context;

        public NotificationHub(
            INotificationService notificationService,
            IUserService userService,
            AppDbContext context)
        {
            _notificationService = notificationService;
            _userService = userService;
            _context = context;
        }

        /// <summary>
        /// Sends a notification to a specific user
        /// </summary>
        public async Task SendNotification(string recipientUsername, string message)
        {
            var recipient = _userService.GetUserByUsername(recipientUsername);
            if (recipient == null) return;

            var notification = new Notification
            {
                UserId = recipient.Id,
                Message = message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            await Clients.User(recipient.Id.ToString())
                .SendAsync("ReceiveNotification", new
                {
                    id = notification.Id,
                    message = notification.Message,
                    createdAt = notification.CreatedAt,
                    isRead = notification.IsRead
                });
        }

        /// Sends a notification to multiple users
        public async Task SendNotificationToMany(List<string> recipientUsernames, string message)
        {
            foreach (var username in recipientUsernames)
            {
                await SendNotification(username, message);
            }
        }

        /// Marks a notification as read
        public async Task MarkAsRead(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return;

            notification.IsRead = true;
            //notification.ReadAt = DateTime.UtcNow;

            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();

            await Clients.User(notification.UserId.ToString())
                .SendAsync("NotificationRead", notificationId);
        }

        /// Gets all unread notifications for a user
        public async Task<List<Notification>> GetUnreadNotifications(string username)
        {
            var user = await _userService.GetUserByUsernameAsync(username);
            if (user == null) return new List<Notification>();

            return await _context.Notifications
                .Where(n => n.UserId == user.Id && n.IsRead == false)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        /// Handles client connection
        public override async Task OnConnectedAsync()
        {
            var userIdClaim = Context.User?.FindFirst("sub")?.Value;
            if (!string.IsNullOrEmpty(userIdClaim))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userIdClaim}");
            }
            await base.OnConnectedAsync();
        }

        /// Handles client disconnection
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userIdClaim = Context.User?.FindFirst("sub")?.Value;
            if (!string.IsNullOrEmpty(userIdClaim))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"User_{userIdClaim}");
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
