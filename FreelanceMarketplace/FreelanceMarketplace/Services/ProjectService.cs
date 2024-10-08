using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;

        public ProjectService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Project>> GetAllProjectsAsync()
        {
            try
            {
                return await _context.Projects
                    .Include(p => p.Category)  
                    .Include(p => p.Applies)
                    .Include(p => p.Contract)
                    .Include(p => p.Images)    
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving projects", ex);
            }
        }

        public async Task<Project?> GetProjectByIdAsync(int projectId)
        {
            try
            {
                var project = await _context.Projects
                    .Include(p => p.Category)
                    .Include(p => p.Applies)
                    .Include(p => p.Contract)
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.ProjectId == projectId);

                if (project == null)
                    throw new KeyNotFoundException("Project not found");

                return project;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving project with ID {projectId}", ex);
            }
        }

        public async Task<Project> CreateProjectAsync(Project project)
        {
            try
            {
                _context.Projects.Add(project);
                await _context.SaveChangesAsync();
                return project;
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating project", ex);
            }
        }

        public async Task<Project> UpdateProjectAsync(int projectId, Project Project)
        {
            try
            {
                var existingProject = await _context.Projects.FindAsync(projectId);
                if (existingProject == null)
                    throw new KeyNotFoundException("Project not found");

                // Cập nhật thông tin dự án
                existingProject.ProjectName = Project.ProjectName;
                existingProject.ProjectDescription = Project.ProjectDescription;
                existingProject.Budget = Project.Budget;
                existingProject.Deadline = Project.Deadline;
                existingProject.SkillRequire = Project.SkillRequire;
                existingProject.Status = Project.Status;
                existingProject.CategoryId = Project.CategoryId;

                _context.Projects.Update(existingProject);
                await _context.SaveChangesAsync();
                return existingProject; 
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating project", ex);
            }
        }
        public async Task<bool> DeleteProjectAsync(int projectId) 
        {
            try
            {
                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                    throw new KeyNotFoundException("Project not found");

                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();
                return true; 
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting project", ex);
            }
        }
    }
}