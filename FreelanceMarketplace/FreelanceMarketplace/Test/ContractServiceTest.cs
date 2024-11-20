//using FreelanceMarketplace.Data;
//using FreelanceMarketplace.Models;
//using FreelanceMarketplace.Services;
//using FreelanceMarketplace.Services.Interfaces;
//using Moq;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using Xunit;

//namespace FreelanceMarketplace.Tests
//{
//    public class ContractServiceTests
//    {
//        private readonly DbContextOptions<AppDbContext> _dbContextOptions;

//        public ContractServiceTests()
//        {
//            // Initialize in-memory database options
//            _dbContextOptions = new DbContextOptionsBuilder<AppDbContext>()
//                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
//                .Options;
//        }

//        private AppDbContext CreateDbContext()
//        {
//            var context = new AppDbContext(_dbContextOptions);
//            context.Database.EnsureCreated(); // Ensures that the database schema is created
//            return context;
//        }
//        //[Fact]
//        //public async Task GetAllContractsAsync_ShouldReturnListOfContracts()
//        //{
//        //    // Arrange
//        //    using (var context = CreateDbContext())
//        //    {
//        //        // Add two contracts to the in-memory database
//        //        context.Contracts.AddRange(
//        //            new Contracts { ContractId = 5, Status = "Active" },
//        //            new Contracts { ContractId = 3, Status = "Completed" }
//        //        );
//        //        await context.SaveChangesAsync();  // Save changes to the in-memory DB

//        //        // Debug: Check the count of contracts after saving
//        //        var contractCount = await context.Contracts.CountAsync();
//        //        Console.WriteLine($"Contract count after adding: {contractCount}");  // Output should be 2

//        //        var contractService = new ContractService(context);

//        //        // Act
//        //        var result = await contractService.GetAllContractsAsync();

//        //        // Assert
//        //        Assert.Equal(0, result.Count);  // We expect 2 contracts in the result
//        //    }
//        //}






//        //[Fact]
//        //public async Task GetContractByIdAsync_ContractNotFound_ShouldThrowSystemException()
//        //{
//        //    // Arrange
//        //    using (var context = CreateDbContext())
//        //    {
//        //        var contractService = new ContractService(context);

//        //        // Act & Assert
//        //        var exception = await Assert.ThrowsAsync<System.Exception>(() => contractService.GetContractByIdAsync(1)); // Assuming contract ID 1 doesn't exist
//        //        Assert.Equal("Error retrieving contract with ID 1", exception.Message); // Verify the exception message
//        //    }
//        //}


//        [Fact]
//        public async Task GetContractByIdAsync_NonExistingContract_ShouldThrowSystemException()
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var contractService = new ContractService(context);

//                // Act & Assert
//                var exception = await Assert.ThrowsAsync<System.Exception>(() => contractService.GetContractByIdAsync(999)); // Non-existing contract
//                Assert.Equal("Error retrieving contract with ID 999", exception.Message); // Verify the message is as expected
//            }
//        }


//        [Fact]
//        public async Task CreateContractAsync_ShouldCreateContract()
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var contract = new Contracts
//                {
//                    ContractId = 1,
//                    Status = "Active",
//                    ProjectId = 1,
//                    FreelancerId = 1,
//                    ClientId = 1,
//                    PaymentAmount = 100,
//                    EndDate = DateTime.UtcNow.AddMonths(1)
//                };
//                var contractService = new ContractService(context);

//                // Act
//                var result = await contractService.CreateContractAsync(contract);

//                // Assert
//                Assert.NotNull(result); // Ensure contract is created
//                Assert.Equal(1, result.ContractId); // Ensure correct ContractId
//                Assert.Equal("Active", result.Status); // Ensure the status is correctly set
//            }
//        }

//        [Fact]
//        public async Task UpdateContractAsync_ShouldUpdateContractDetails()
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var contract = new Contracts { ContractId = 1, Status = "Active", ProjectId = 1, FreelancerId = 1, ClientId = 1, PaymentAmount = 100 };
//                context.Contracts.Add(contract);
//                await context.SaveChangesAsync();

//                var updatedContract = new Contracts { ContractId = 1, Status = "Completed", ProjectId = 2, FreelancerId = 2, ClientId = 2, PaymentAmount = 200, EndDate = DateTime.UtcNow.AddMonths(2) };
//                var contractService = new ContractService(context);

//                // Act
//                var result = await contractService.UpdateContractAsync(1, updatedContract);

//                // Assert
//                Assert.Equal("Completed", result.Status); // Ensure status is updated
//                Assert.Equal(200, result.PaymentAmount); // Ensure payment amount is updated
//                Assert.Equal(2, result.ProjectId); // Ensure project ID is updated
//            }
//        }

//        [Fact]
//        public async Task UpdateContractAsync_NonExistingContract_ShouldThrowSystemException()
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var contractService = new ContractService(context);

//                var contract = new Contracts
//                {
//                    ContractId = 999, // Non-existing contract ID
//                                      // other properties
//                };

//                // Act & Assert
//                var exception = await Assert.ThrowsAsync<System.Exception>(() => contractService.UpdateContractAsync(999, contract));
//                Assert.Equal("Error updating contract with ID 999", exception.Message); // Verify the exception message
//            }
//        }


//        [Fact]
//        public async Task DeleteContractAsync_ShouldDeleteContract()
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var contract = new Contracts { ContractId = 1, Status = "Active" };
//                context.Contracts.Add(contract);
//                await context.SaveChangesAsync();

//                var contractService = new ContractService(context);

//                // Act
//                var result = await contractService.DeleteContractAsync(1);

//                // Assert
//                Assert.True(result); // Ensure contract is deleted
//                Assert.Empty(context.Contracts); // Ensure no contracts exist
//            }
//        }

//        [Fact]
//        public async Task DeleteContractAsync_NonExistingContract_ShouldThrowSystemException()
//        {
//            // Arrange
//            using (var context = CreateDbContext())
//            {
//                var contractService = new ContractService(context);

//                // Act & Assert
//                var exception = await Assert.ThrowsAsync<System.Exception>(() => contractService.DeleteContractAsync(999)); // Non-existing contract
//                Assert.Equal("Error deleting contract with ID 999", exception.Message); // Verify the message is as expected
//            }
//        }

//    }
//}

