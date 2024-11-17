using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs.Req;
using FreelanceMarketplace.Services;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System.Linq.Expressions;

namespace FreelanceMarketplace.Tests
{
    public class UserServiceTests
    {
        private readonly Mock<AppDbContext> _mockContext;
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "FreelancerMarketplaceTestDb")
                .Options;

            _mockContext = new Mock<AppDbContext>(options);
            _mockEmailService = new Mock<IEmailService>();
            _userService = new UserService(_mockContext.Object, _mockEmailService.Object);
        }

        [Fact]
        public async Task RegisterUserAsync_ShouldReturnTrue_WhenUserIsRegisteredSuccessfully()
        {
            var registerReq = new RegisterReq
            {
                Username = "testuser",
                Email = "testuser@example.com",
                Password = "Password123",
                Role = "Client"
            };

            var result = await _userService.RegisterUserAsync(registerReq);

            Assert.True(result);
            _mockEmailService.Verify(
                x => x.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),
                Times.Once);
        }

        [Fact]
        public async Task RegisterUserAsync_ShouldReturnFalse_WhenUserAlreadyExists()
        {
            var registerReq = new RegisterReq
            {
                Username = "existinguser",
                Email = "existinguser@example.com",
                Password = "Password123",
                Role = "Client"
            };

            _mockContext.Setup(x => x.Users
                .FirstOrDefaultAsync(It.IsAny<Expression<Func<Users, bool>>>(), default))
                .ReturnsAsync(new Users { Username = registerReq.Username });

            var result = await _userService.RegisterUserAsync(registerReq);

            Assert.False(result);
        }




        [Fact]
        public async Task ConfirmEmailAsync_ShouldReturnTrue_WhenTokenIsValid()
        {
            var userId = 1;
            var token = "valid_token";
            var user = new Users { Id = userId, EmailConfirmationToken = token };

            // Thiết lập mock với It.IsAny<CancellationToken>()
            _mockContext.Setup(x => x.Users.SingleOrDefaultAsync(
                u => u.Id == userId && u.EmailConfirmationToken == token,
                It.IsAny<CancellationToken>())
            ).ReturnsAsync(user);

            var result = await _userService.ConfirmEmailAsync(userId, token);

            Assert.True(result);
            Assert.True(user.IsEmailConfirmed);
            Assert.Null(user.EmailConfirmationToken);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }


        [Fact]
        public async Task ConfirmEmailAsync_ShouldReturnFalse_WhenTokenIsInvalid()
        {
            var userId = 1;
            var token = "invalid_token";

            _mockContext.Setup(x => x.Users
                .SingleOrDefaultAsync(It.IsAny<Expression<Func<Users, bool>>>(), default))
                .ReturnsAsync((Users)null);

            var result = await _userService.ConfirmEmailAsync(userId, token);

            Assert.False(result);
        }


        [Fact]
        public void Authenticate_ShouldReturnUser_WhenCredentialsAreCorrect()
        {
            var username = "testuser";
            var password = "Password123";
            var user = new Users { Username = username, PasswordHash = new PasswordHasher<Users>().HashPassword(null, password) };

            _mockContext.Setup(x => x.Users.SingleOrDefault(It.IsAny<Func<Users, bool>>())).Returns(user);

            var result = _userService.Authenticate(username, password);

            Assert.NotNull(result);
            Assert.Equal(username, result.Username);
        }

        [Fact]
        public void Authenticate_ShouldReturnNull_WhenCredentialsAreIncorrect()
        {
            var username = "testuser";
            var password = "WrongPassword";

            _mockContext.Setup(x => x.Users.SingleOrDefault(It.IsAny<Func<Users, bool>>()))
                        .Returns((Users)null);

            var result = _userService.Authenticate(username, password);

            Assert.Null(result);
        }

        [Fact]
        public void SaveRefreshToken_ShouldSaveToken()
        {
            int userId = 1;
            string token = "sample_refresh_token";

            _userService.SaveRefreshToken(userId, token);

            _mockContext.Verify(x => x.RefreshTokens.Add(It.Is<RefreshTokens>(t => t.UserId == userId && t.Token == token)), Times.Once);
            _mockContext.Verify(x => x.SaveChanges(), Times.Once);
        }

        [Fact]
        public void GetRefreshToken_ShouldReturnLatestToken_WhenExists()
        {
            int userId = 1;
            var expectedToken = new RefreshTokens { UserId = userId, Token = "latest_token", ExpiryDate = DateTime.UtcNow.AddDays(1) };
            _mockContext.Setup(x => x.RefreshTokens.Where(It.IsAny<Func<RefreshTokens, bool>>()))
                        .Returns(new[] { expectedToken }.AsQueryable());

            var result = _userService.GetRefreshToken(userId);

            Assert.Equal(expectedToken, result);
        }

        [Fact]
        public void GetRefreshTokenByToken_ShouldReturnToken_WhenTokenExists()
        {
            string token = "sample_token";
            var refreshToken = new RefreshTokens { Token = token };
            _mockContext.Setup(x => x.RefreshTokens.SingleOrDefault(It.IsAny<Func<RefreshTokens, bool>>()))
                        .Returns(refreshToken);

            var result = _userService.GetRefreshTokenByToken(token);

            Assert.Equal(refreshToken, result);
        }

        [Fact]
        public void MarkRefreshTokenAsUsed_ShouldMarkTokenAsUsed()
        {
            var refreshToken = new RefreshTokens { Token = "token_to_mark", IsUsed = false };

            _userService.MarkRefreshTokenAsUsed(refreshToken);

            Assert.True(refreshToken.IsUsed);
            _mockContext.Verify(x => x.RefreshTokens.Update(refreshToken), Times.Once);
            _mockContext.Verify(x => x.SaveChanges(), Times.Once);
        }

        [Fact]
        public async Task GetUserById_ShouldReturnUser_WhenUserExists()
        {
            // Arrange
            int userId = 1;
            var user = new Users { Id = userId };
           
            _mockContext.Setup(x => x.Users.FindAsync(userId))
                        .ReturnsAsync(user);

            // Act
            var result = await _userService.GetUserById(userId);

            // Assert
            Assert.Equal(user, result);
        }


        [Fact]
        public async Task GetUserByUsername_ShouldReturnUser_WhenUserExists()
        {
            string username = "testuser";
            var user = new Users { Username = username };

            _mockContext.Setup(x => x.Users
                .Include(It.IsAny<string>()) // Optional Includes, depending on your model
                .Include(It.IsAny<string>())
                .FirstOrDefaultAsync(It.IsAny<Expression<Func<Users, bool>>>(), default)) 
                .ReturnsAsync(user);

            var result = await _userService.GetUserByUsername(username);

            Assert.Equal(user, result);
        }




        [Fact]
        public async Task GetUserByUsernameAsync_ShouldReturnUser_WhenUserExists()
        {
            string username = "testuser";
            var user = new Users { Username = username };

            _mockContext.Setup(x => x.Users
                .FirstOrDefaultAsync(It.IsAny<Expression<Func<Users, bool>>>(), default))
                .ReturnsAsync(user);

            var result = await _userService.GetUserByUsernameAsync(username);

            Assert.Equal(user, result);
        }


        [Fact]
        public void GetUsers_ShouldReturnAllUsers()
        {
            var users = new List<Users> { new Users { Username = "user1" }, new Users { Username = "user2" } };
            _mockContext.Setup(x => x.Users.ToList()).Returns(users);

            var result = _userService.GetUsers();

            Assert.Equal(users.Count, result.Count);
        }

        [Fact]
        public void DeleteUserById_ShouldReturnTrue_WhenUserExists()
        {
            int userId = 1;
            var user = new Users { Id = userId };
            _mockContext.Setup(x => x.Users.Find(userId)).Returns(user);

            var result = _userService.DeleteUserById(userId);

            Assert.True(result);
            _mockContext.Verify(x => x.Users.Remove(user), Times.Once);
            _mockContext.Verify(x => x.SaveChanges(), Times.Once);
        }

        [Fact]
        public void DeleteUserById_ShouldReturnFalse_WhenUserDoesNotExist()
        {
            int userId = 1;
            _mockContext.Setup(x => x.Users.Find(userId)).Returns((Users)null);

            var result = _userService.DeleteUserById(userId);

            Assert.False(result);
            _mockContext.Verify(x => x.Users.Remove(It.IsAny<Users>()), Times.Never);
            _mockContext.Verify(x => x.SaveChanges(), Times.Never);
        }

        //[Fact]
        //public void GetOrCreateUserFromGoogleToken_ShouldReturnExistingUser_WhenUserExists()
        //{
        //    string googleEmail = "user@example.com";
        //    var user = new Users { Email = googleEmail };
        //    _mockContext.Setup(x => x.Users.FirstOrDefault(It.IsAny<Func<Users, bool>>())).Returns(user);

        //    var result = _userService.GetOrCreateUserFromGoogleToken(googleEmail);

        //    Assert.Equal(user, result);
        //}

        //[Fact]
        //public void GetOrCreateUserFromGoogleToken_ShouldCreateAndReturnUser_WhenUserDoesNotExist()
        //{
        //    string googleEmail = "newuser@example.com";
        //    var user = new Users { Email = googleEmail };
        //    _mockContext.Setup(x => x.Users.Add(user));

        //    var result = _userService.GetOrCreateUserFromGoogleToken(googleEmail);

        //    Assert.Equal(user, result);
        //    _mockContext.Verify(x => x.SaveChanges(), Times.Once);
        //}
    }
}
