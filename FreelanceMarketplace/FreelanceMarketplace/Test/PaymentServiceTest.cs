using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace FreelanceMarketplace.Tests
{
    public class PaymentServiceTests
    {
        private readonly AppDbContext _dbContext;
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly PaymentService _paymentService;

        public PaymentServiceTests()
        {
            // Set up in-memory database options
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            // Initialize DbContext with in-memory options
            _dbContext = new AppDbContext(options);

            // Initialize mock services
            _mockNotificationService = new Mock<INotificationService>();

            // Initialize PaymentService with real DbContext and mocked notification service
            _paymentService = new PaymentService(_dbContext, _mockNotificationService.Object);
        }

        [Fact]
        public async Task CreatePaymentAsyncShouldThrowIfInsufficientBalance()
        {
            // Arrange
            var payment = new Payment
            {
                PaymentId = 1,
                UserId = 1,
                Amount = 100,
                ContractId = 1,               // Set required property
                Description = "Test payment"   // Set required property
            }; var wallet = new Wallet { UserId = 1, Balance = 50 }; // Insufficient balance

            // Seed wallet into the in-memory database
            _dbContext.Wallets.Add(wallet);
            await _dbContext.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => _paymentService.CreatePaymentAsync(payment));
            Assert.Equal("Insufficient balance for this payment.", exception.Message);
        }

        [Fact]
        public async Task CreatePaymentAsync_ShouldThrowIfInsufficientBalance()
        {
            // Arrange
            var payment = new Payment
            {
                PaymentId = 1,
                UserId = 1,
                Amount = 100,
                ContractId = 1,               // Set required property
                Description = "Test payment"   // Set required property
            };
            var wallet = new Wallet { UserId = 1, Balance = 50 }; // Insufficient balance

            // Seed wallet into the in-memory database
            _dbContext.Wallets.Add(wallet);
            await _dbContext.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => _paymentService.CreatePaymentAsync(payment));
            Assert.Equal("Insufficient balance for this payment.", exception.Message);
        }


        [Fact]
        public async Task RefundPaymentAsync_ShouldRefundPaymentAndUpdateWallet()
        {
            // Arrange
            var payment = new Payment
            {
                PaymentId = 1,
                UserId = 1,
                Amount = 100,
                ContractId = 1, // Required
                Description = "Test Refund" // Required
            };
            var wallet = new Wallet { UserId = 1, Balance = 200 };

            // Seed payment and wallet into the in-memory database
            _dbContext.Payments.Add(payment);
            _dbContext.Wallets.Add(wallet);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _paymentService.RefundPaymentAsync(payment.PaymentId);

            // Assert
            Assert.Equal(300, wallet.Balance); // Wallet balance increased by refund amount
            Assert.Equal("Refunded", result.Status); // Payment status updated
            _mockNotificationService.Verify(n => n.CreateNotificationAsync(It.IsAny<Notification>()), Times.Once);
        }

        [Fact]
        public async Task GetAllPaymentsAsync_ShouldReturnListOfPayments()
        {
            // Arrange
            var payments = new List<Payment>
{
    new Payment { PaymentId = 1, UserId = 1, Amount = 100, ContractId = 1, Description = "Payment for contract 1" },
    new Payment { PaymentId = 2, UserId = 2, Amount = 200, ContractId = 2, Description = "Payment for contract 2" }
};


            // Seed payments into the in-memory database
            await _dbContext.Payments.AddRangeAsync(payments);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _paymentService.GetAllPaymentsAsync();

            // Assert
            Assert.Equal(2, result.Count); // Verify the number of payments returned
        }

        [Fact]
        public async Task GetPaymentByIdAsync_ShouldReturnPayment()
        {
            // Arrange
            var paymentId = 2;
            var payment = new Payment
            {
                PaymentId = 2,
                UserId = 1,
                Amount = 100,
                ContractId = 1, // Required
                Description = "Test Refund" // Required
            };

            // Seed payment into the in-memory database
            _dbContext.Payments.Add(payment);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _paymentService.GetPaymentByIdAsync(paymentId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(paymentId, result.PaymentId);
        }

        [Fact]
        public async Task DeletePaymentAsync_ShouldReturnTrueIfPaymentDeleted()
        {
            // Arrange
            var paymentId = 1;
            var payment = new Payment
            {
                PaymentId = 1,
                UserId = 1,
                Amount = 100,
                ContractId = 1, // Required
                Description = "Test Refund" // Required
            };

            // Seed payment into the in-memory database
            _dbContext.Payments.Add(payment);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _paymentService.DetetePaymentAsync(paymentId);

            // Assert
            Assert.True(result); // Ensure the method returns true
            Assert.DoesNotContain(await _dbContext.Payments.ToListAsync(), p => p.PaymentId == paymentId);
        }
    }
}
