using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IProjectService
    {
        Task<List<Project>> GetAllProjectsAsync();
        Task<List<Project>> GetProjectByClientAsync(int clientId);
        Task<Project?> GetProjectByIdAsync(int projectId);
        Task<Project> CreateProjectAsync(Project project);
        Task<Project> UpdateProjectAsync(int projectId, Project updatedProject);
        Task<bool> DeleteProjectAsync(int projectId);
        Task<bool> CheckScheduleConflictAsync(int userId, int projectId);
        Task<List<Project>> GetPopularProjectsAsync();
        Task<List<Project>> GetProjectsWithPagingAndSortingAsync(int page = 1, int pageSize = 10, string sortBy = "ProjectName", bool isAscending = true);
        Task<List<Project>> GetProjectsWithPagingAsync(int page = 1, int pageSize = 10);
        Task<List<Project>> GetProjectsWithSortingAsync(string sortBy = "ProjectName", bool isAscending = true);
        Task<List<ProjectWithImageDto>> GetAllProjectsWithImageAsync();

    }
}
