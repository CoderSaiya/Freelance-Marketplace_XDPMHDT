using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.Services.Interface
{
    public interface IProjectService
    {
        Task<List<Project>> GetAllProjectsAsync();
        Task<Project?> GetProjectByIdAsync(int projectId);
        Task<Project> CreateProjectAsync(Project project);
        Task<Project> UpdateProjectAsync(int projectId, Project updatedProject);
        Task<bool> DeleteProjectAsync(int projectId);
        Task<bool> CheckScheduleConflictAsync(int userId, int projectId);
        Task<List<Project>> GetPopularProjectsAsync();


    }
}
