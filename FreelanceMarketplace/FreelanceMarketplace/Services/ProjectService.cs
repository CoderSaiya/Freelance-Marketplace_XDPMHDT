using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
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

        public async Task<bool> CheckScheduleConflictAsync(int userId, int projectId)
        {
            try
            {
                var newProject = await _context.Projects.FindAsync(projectId);
                if (newProject == null)
                    throw new KeyNotFoundException("Project not found");

                var activeProjects = await _context.Applies
                    .Include(a => a.Project)
                    .Where(a => a.UserId == userId && a.Status == "Accepted")
                    .ToListAsync();

                DateTime newProjectStart = DateTime.Now;
                DateTime newProjectEnd = newProject.Deadline;

                // Kiểm tra xung đột lịch
                foreach (var apply in activeProjects)
                {
                    var projectStart = apply.CreateAt;
                    var projectEnd = apply.CreateAt.AddDays(apply.Duration);

                    if (newProjectStart < projectEnd && newProjectEnd > projectStart)
                    {
                        return true; 
                    }
                }
                return false; 
            }
            catch (Exception ex)
            {
                throw new Exception("Error checking schedule conflicts", ex);
            }
        }

        public async Task<List<Project>> GetPopularProjectsAsync()
        {
            try
            {
                var projects = await _context.Projects
                    .Include(p => p.Applies) 
                    .ToListAsync();

                // Sắp xếp các dự án dựa trên số lượng apply giảm dần
                var sortedProjects = projects
                    .OrderByDescending(p => p.Applies.Count)
                    .ToList();

                return sortedProjects;
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving popular projects", ex);
            }
        }

        public async Task<List<Project>> GetProjectsWithPagingAndSortingAsync(int page = 1, int pageSize = 10, string sortBy = "ProjectName", bool isAscending = true)
        {
            try
            {
                var query = _context.Projects
                    .Include(p => p.Category)
                    .Include(p => p.Applies)
                    .Include(p => p.Contract)
                    .Include(p => p.Images)
                    .AsQueryable();

                // Apply sorting
                query = sortBy switch
                {
                    "Budget" => isAscending ? query.OrderBy(p => p.Budget) : query.OrderByDescending(p => p.Budget),
                    "Deadline" => isAscending ? query.OrderBy(p => p.Deadline) : query.OrderByDescending(p => p.Deadline),
                    "Status" => isAscending ? query.OrderBy(p => p.Status) : query.OrderByDescending(p => p.Status),
                    _ => isAscending ? query.OrderBy(p => p.ProjectName) : query.OrderByDescending(p => p.ProjectName)
                };

                // Apply paging
                return await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving projects with paging and sorting", ex);
            }
        }

        public async Task<List<Project>> GetProjectsWithPagingAsync(int page = 1, int pageSize = 10)
        {
            try
            {
                return await _context.Projects
                    .Include(p => p.Category)
                    .Include(p => p.Applies)
                    .Include(p => p.Contract)
                    .Include(p => p.Images)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving projects with paging", ex);
            }
        }

        public async Task<List<Project>> GetProjectsWithSortingAsync(string sortBy = "ProjectName", bool isAscending = true)
        {
            try
            {
                var query = _context.Projects
                    .Include(p => p.Category)
                    .Include(p => p.Applies)
                    .Include(p => p.Contract)
                    .Include(p => p.Images)
                    .AsQueryable();

                // Apply sorting based on the sortBy parameter
                query = sortBy switch
                {
                    "Budget" => isAscending ? query.OrderBy(p => p.Budget) : query.OrderByDescending(p => p.Budget),
                    "Deadline" => isAscending ? query.OrderBy(p => p.Deadline) : query.OrderByDescending(p => p.Deadline),
                    "Status" => isAscending ? query.OrderBy(p => p.Status) : query.OrderByDescending(p => p.Status),
                    _ => isAscending ? query.OrderBy(p => p.ProjectName) : query.OrderByDescending(p => p.ProjectName)
                };

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving projects with sorting", ex);
            }
        }

    }
}