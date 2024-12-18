//using Xunit;
//using Microsoft.EntityFrameworkCore;
//using FreelanceMarketplace.Models;
//using FreelanceMarketplace.Services;
//using FreelanceMarketplace.Data;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using System;

//namespace FreelanceMarketplace.Tests
//{
//    public class ProjectServiceTests
//    {
//        private readonly ProjectService _projectService;
//        private readonly AppDbContext _context;

//        public ProjectServiceTests()
//        {
//            // Set up the InMemory database
//            var options = new DbContextOptionsBuilder<AppDbContext>()
//                .UseInMemoryDatabase(databaseName: "TestDatabase")
//                .Options;

//            _context = new AppDbContext(options);
//            _projectService = new ProjectService(_context);

     
//        }

//        [Fact]
//        public async Task GetAllProjectsAsync_ReturnsAllProjects()
//        {
//            // Arrange
//            var newProject1 = new Project
//            {
//                ProjectName = "Project 1",
//                ProjectDescription = "Description for Project 1",
//                Budget = 1000,
//                Deadline = DateTime.Now.AddMonths(1),
//                SkillRequire = "C#",
//                Status = "Open",
//                CategoryId = 1
//            };

//            var newProject2 = new Project
//            {
//                ProjectName = "Project 2",
//                ProjectDescription = "Description for Project 2",
//                Budget = 2000,
//                Deadline = DateTime.Now.AddMonths(2),
//                SkillRequire = "Java",
//                Status = "Open",
//                CategoryId = 2
//            };

//            // Adding projects to the in-memory database
//            _context.Projects.AddRange(newProject1, newProject2);
//            await _context.SaveChangesAsync();

//            // Act
//            var result = await _projectService.GetAllProjectsAsync();

//            // Assert
//            Assert.NotNull(result); // Ensure result is not null
//            Assert.Equal(3, result.Count); // Verify that two projects are returned
//            Assert.Contains(result, p => p.ProjectName == "Project 1"); // Check that Project 1 is in the result
//            Assert.Contains(result, p => p.ProjectName == "Project 2"); // Check that Project 2 is in the result
//            Assert.All(result, p => Assert.NotNull(p.ProjectDescription)); // Ensure ProjectDescription is not null for all projects
//            Assert.All(result, p => Assert.NotNull(p.Status)); // Ensure Status is not null for all projects
//        }


//        [Fact]
//        public async Task CreateProjectAsync_AddsNewProject()
//        {
//            // Arrange
//            var newProject = new Project
//            {
//                ProjectName = "New Project",
//                Budget = 1500,
//                ProjectDescription = "Description of the new project",  // Ensure required fields are set
//                Status = "Open",  // Ensure required fields are set
//                Deadline = DateTime.Now.AddDays(30),
//                SkillRequire = "C#",
//                CategoryId = 1
//            };

//            // Act
//            var result = await _projectService.CreateProjectAsync(newProject);

//            // Assert
//            var projectInDb = await _context.Projects.FindAsync(result.ProjectId);
//            Assert.NotNull(projectInDb);
//            Assert.Equal("New Project", projectInDb.ProjectName);
//        }



      
//    }
//}
