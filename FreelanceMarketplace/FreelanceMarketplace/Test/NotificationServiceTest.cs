using FreelanceMarketplace.Data;
using FreelanceMarketplace.Hubs;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace FreelanceMarketplace.Tests
{
    public class NotificationServiceTests
    {
        private readonly AppDbContext _context;
        private readonly Mock<IHubContext<ChatHub>> _mockHubContext;
        private readonly Mock<IHubClients> _mockClients;
        private readonly Mock<IClientProxy> _mockClientProxy;
        private readonly NotificationService _service;

        public NotificationServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _context = new AppDbContext(options);

            _mockHubContext = new Mock<IHubContext<ChatHub>>();
            _mockClients = new Mock<IHubClients>();
            _mockClientProxy = new Mock<IClientProxy>();

            _mockHubContext.Setup(h => h.Clients).Returns(_mockClients.Object);
            _mockClients.Setup(c => c.User(It.IsAny<string>())).Returns(_mockClientProxy.Object);

            _service = new NotificationService(_context, _mockHubContext.Object);
        }

        [Fact]
        public async Task CreateNotificationAsync_ShouldAddNotificationToDatabase()
        {
            // Arrange
            var notification = new Notification { UserId = 1, Message = "New notification" };

            // Act
            var result = await _service.CreateNotificationAsync(notification);

            // Assert
            var savedNotification = await _context.Notifications.FindAsync(result.Id);
            //_mockClientProxy.Verify(c => c.SendAsync("ReceiveNotification", notification.Message);
            Assert.NotNull(savedNotification);
            Assert.Equal("New notification", savedNotification.Message);
            Assert.False(savedNotification.IsRead);
        }

        [Fact]
        public async Task GetNotificationByIdAsync_ShouldReturnNotification()
        {
            // Arrange
            var notification = new Notification { Id = 1, UserId = 1, Message = "Test message" };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetNotificationByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("Test message", result.Message);
        }

        [Fact]
        public async Task GetNotificationsByUserIdAsync_ShouldReturnUserNotifications()
        {
            // Arrange
            var notifications = new List<Notification>
            {
                new Notification { Id = 1, UserId = 1, Message = "Notification 1" },
                new Notification { Id = 2, UserId = 1, Message = "Notification 2" }
            };
            _context.Notifications.AddRange(notifications);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetNotificationsByUserIdAsync(1);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, n => n.Message == "Notification 1");
            Assert.Contains(result, n => n.Message == "Notification 2");
        }

        [Fact]
        public async Task UpdateNotificationAsync_ShouldModifyNotification()
        {
            // Arrange
            var notification = new Notification { Id = 1, UserId = 1, Message = "Old Message" };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Act
            notification.Message = "Updated Message";
            var result = await _service.UpdateNotificationAsync(notification);

            // Assert
            var updatedNotification = await _context.Notifications.FindAsync(result.Id);
            Assert.Equal("Updated Message", updatedNotification.Message);
        }

        [Fact]
        public async Task DeleteNotificationAsync_ShouldRemoveNotification()
        {
            // Arrange
            var notification = new Notification { Id = 1 };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.DeleteNotificationAsync(1);

            // Assert
            var deletedNotification = await _context.Notifications.FindAsync(1);
            Assert.True(result);
            Assert.Null(deletedNotification);
        }

        [Fact]
        public async Task MarkNotificationAsReadAsync_ShouldUpdateIsReadStatus()
        {
            // Arrange
            var notification = new Notification { Id = 1, IsRead = false };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.MarkNotificationAsReadAsync(1);

            // Assert
            var updatedNotification = await _context.Notifications.FindAsync(1);
            Assert.True(result);
            Assert.True(updatedNotification.IsRead);
        }
    }
}
