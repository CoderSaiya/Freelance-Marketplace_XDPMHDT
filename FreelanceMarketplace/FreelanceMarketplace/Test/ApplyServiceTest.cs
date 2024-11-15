using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace FreelanceMarketplace.Tests
{
    public class ApplyServiceTests
    {
        private readonly AppDbContext _context;
        private readonly ApplyService _applyService;

        public ApplyServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestApplyDatabase")
                .Options;
            _context = new AppDbContext(options);

            _applyService = new ApplyService(_context);
        }

        [Fact]
        public async Task CreateApplyAsync_ShouldCreateApply()
        {
            // Arrange
            var apply = new Apply
            {
                FreelancerId = 1,
                ClientId = 2,
                ProjectId = 3,
                Status = "Pending",
                Duration = 30
            };

            // Act
            var result = await _applyService.CreateApplyAsync(apply);

            // Assert
            var savedApply = await _context.Applies.FindAsync(result.ApplyId);
            Assert.NotNull(savedApply);
            Assert.Equal("Pending", savedApply.Status);
            Assert.Equal(1, savedApply.FreelancerId);
            Assert.Equal(3, savedApply.ProjectId);
        }

        [Fact]
        public async Task GetApplyByFreelancerIdAsync_ShouldReturnAppliesForFreelancer()
        {
            // Arrange
            var apply1 = new Apply { FreelancerId = 1, ClientId = 2, ProjectId = 3, Status = "Pending" };
            var apply2 = new Apply { FreelancerId = 1, ClientId = 2, ProjectId = 4, Status = "Pending" };
            _context.Applies.AddRange(apply1, apply2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _applyService.GetApplyByFreelancerIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetApplyByIdAsync_ShouldReturnApply_WhenIdExists()
        {
            // Arrange
            var apply = new Apply { FreelancerId = 1, ClientId = 2, ProjectId = 3, Status = "Pending" };
            _context.Applies.Add(apply);
            await _context.SaveChangesAsync();

            // Act
            var result = await _applyService.GetApplyByIdAsync(apply.ApplyId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Pending", result.Status);
        }

        [Fact]
        public async Task GetApplyByIdAsync_ShouldThrowKeyNotFoundException_WhenIdDoesNotExist()
        {
            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await _applyService.GetApplyByIdAsync(999));
        }

        [Fact]
        public async Task GetAppliesForProjectAsync_ShouldReturnAppliesForProject()
        {
            // Arrange
            var apply1 = new Apply { FreelancerId = 1, ClientId = 2, ProjectId = 3, Status = "Pending" };
            var apply2 = new Apply { FreelancerId = 2, ClientId = 3, ProjectId = 3, Status = "Pending" };
            _context.Applies.AddRange(apply1, apply2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _applyService.GetAppliesForProjectAsync(3);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task UpdateApplyAsync_ShouldUpdateApplyStatus()
        {
            // Arrange
            var apply = new Apply { FreelancerId = 1, ClientId = 2, ProjectId = 3, Status = "Pending" };
            _context.Applies.Add(apply);
            await _context.SaveChangesAsync();

            // Act
            apply.Status = "Accepted";
            var result = await _applyService.UpdateApplyAsync(apply);

            // Assert
            var updatedApply = await _context.Applies.FindAsync(apply.ApplyId);
            Assert.NotNull(updatedApply);
            Assert.Equal("Accepted", updatedApply.Status);
        }

        [Fact]
        public async Task UpdateApplyAsync_ShouldThrowKeyNotFoundException_WhenApplyDoesNotExist()
        {
            // Act & Assert
            var apply = new Apply { ApplyId = 999, FreelancerId = 1, ClientId = 2, ProjectId = 3 };
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await _applyService.UpdateApplyAsync(apply));
        }

        [Fact]
        public async Task DeleteApplyAsync_ShouldDeleteApply()
        {
            // Arrange
            var apply = new Apply { FreelancerId = 1, ClientId = 2, ProjectId = 3, Status = "Pending" };
            _context.Applies.Add(apply);
            await _context.SaveChangesAsync();

            // Act
            var result = await _applyService.DeleteApplyAsync(apply.ApplyId);

            // Assert
            var deletedApply = await _context.Applies.FindAsync(apply.ApplyId);
            Assert.True(result);
            Assert.Null(deletedApply);
        }

        [Fact]
        public async Task DeleteApplyAsync_ShouldReturnFalse_WhenApplyDoesNotExist()
        {
            // Act & Assert
            var result = await _applyService.DeleteApplyAsync(999);
            Assert.False(result);
        }

        [Fact]
        public async Task HasFreelancerAppliedForProjectAsync_ShouldReturnTrue_WhenFreelancerApplied()
        {
            // Arrange
            var apply = new Apply { FreelancerId = 1, ClientId = 2, ProjectId = 3, Status = "Pending" };
            _context.Applies.Add(apply);
            await _context.SaveChangesAsync();

            // Act
            var result = await _applyService.HasFreelancerAppliedForProjectAsync(1, 3);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task HasFreelancerAppliedForProjectAsync_ShouldReturnFalse_WhenFreelancerHasNotApplied()
        {
            // Act
            var result = await _applyService.HasFreelancerAppliedForProjectAsync(999, 3);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task AcceptApply_ShouldAcceptApplyAndCreateContract()
        {
            // Arrange
            var apply = new Apply { FreelancerId = 1, ClientId = 2, ProjectId = 3, Status = "Pending", Duration = 30 };
            _context.Applies.Add(apply);
            var project = new Project { ProjectId = 3, Budget = 1000 };
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Act
            var result = await _applyService.AcceptApply(apply.ApplyId);

            // Assert
            var updatedApply = await _context.Applies.FindAsync(apply.ApplyId);
            var contract = await _context.Contracts.FirstOrDefaultAsync(c => c.ProjectId == apply.ProjectId);
            Assert.Equal("Accepted", updatedApply.Status);
            Assert.Equal("Processing", project.Status);
            Assert.NotNull(contract);
            Assert.Equal(1000, contract.PaymentAmount);
        }
    }
}
