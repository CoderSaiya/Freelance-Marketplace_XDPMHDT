using System.Threading.Tasks;
using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace FreelanceMarketplace.Tests
{
    public class WalletServiceTests
    {
        private readonly Mock<AppDbContext> _mockContext;
        private readonly WalletService _walletService;

        public WalletServiceTests()
        {
            // Mock the DbContext with options
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "FreelancerMarketplace")
                .Options;

            _mockContext = new Mock<AppDbContext>(options);
            _walletService = new WalletService(_mockContext.Object);
        }

        [Fact]
        public async Task GetWalletByUserIdAsync_ShouldReturnWallet_WhenWalletExists()
        {
            // Arrange
            var userId = 1;
            var wallet = new Wallet { UserId = userId, Balance = 100m };
            _mockContext.Setup(x => x.Wallets.FindAsync(userId))
                .ReturnsAsync(wallet);

            // Act
            var result = await _walletService.GetWalletByUserIdAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.UserId);
            Assert.Equal(100m, result.Balance);
        }

        [Fact]
        public async Task GetWalletByUserIdAsync_ShouldReturnNull_WhenWalletDoesNotExist()
        {
            // Arrange
            var userId = 2;
            _mockContext.Setup(x => x.Wallets.FindAsync(userId))
                .ReturnsAsync((Wallet)null);

            // Act
            var result = await _walletService.GetWalletByUserIdAsync(userId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateWalletBalanceAsync_ShouldUpdateBalance_WhenWalletExists()
        {
            // Arrange
            var userId = 1;
            var initialBalance = 100m;
            var amountToAdd = 50m;
            var wallet = new Wallet { UserId = userId, Balance = initialBalance };

            _mockContext.Setup(x => x.Wallets.FindAsync(userId))
                .ReturnsAsync(wallet);
            _mockContext.Setup(x => x.SaveChangesAsync(default))
                .ReturnsAsync(1);

            // Act
            var result = await _walletService.UpdateWalletBalanceAsync(userId, amountToAdd);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(initialBalance + amountToAdd, result.Balance);
            _mockContext.Verify(x => x.SaveChangesAsync(default), Times.Once);
        }

        [Fact]
        public async Task UpdateWalletBalanceAsync_ShouldReturnNull_WhenWalletDoesNotExist()
        {
            // Arrange
            var userId = 2;
            _mockContext.Setup(x => x.Wallets.FindAsync(userId))
                .ReturnsAsync((Wallet)null);

            // Act
            var result = await _walletService.UpdateWalletBalanceAsync(userId, 50m);

            // Assert
            Assert.Null(result);
            _mockContext.Verify(x => x.SaveChangesAsync(default), Times.Never);
        }
    }
}
