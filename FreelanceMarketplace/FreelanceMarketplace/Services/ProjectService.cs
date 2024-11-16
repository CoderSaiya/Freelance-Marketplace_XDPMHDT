using FreelanceMarketplace.Data;
using FreelanceMarketplace.Hubs;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public ProjectService(AppDbContext context, IHubContext<NotificationHub> notificationHubContext)
        {
            _context = context;
            _notificationHubContext = notificationHubContext;
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
                    .Include(p => p.Users)
                        .ThenInclude(u => u.UserProfile)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving projects", ex);
            }
        }

        public async Task<List<Project>> GetProjectByClientAsync(int clientId)
        {
            try
            {
                var project = await _context.Projects
                    .Include(p => p.Category)
                    .Include(p => p.Applies)
                        .ThenInclude(a => a.Freelancer)
                            .ThenInclude(f => f.UserProfile)
                    .Include(p => p.Contract)
                    .Include(p => p.Images)
                    .Include(p => p.Users)
                    .Where(p => p.UserId == clientId)
                    .ToListAsync();

                if (project == null)
                    throw new KeyNotFoundException("Project not found");

                return project;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving project with Client ID {clientId}", ex);
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
                    .Include(p => p.Users)
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
                Users admin = _context.Users.FirstOrDefault(u => u.Username == "admin");
                Users recipient = _context.Users.FirstOrDefault(u => u.Id == project.UserId);
                if (admin == null || recipient == null)
                {
                    throw new Exception("Admin or user not found.");
                }
                var message = "A new project has been successfully created!";

                _context.Projects.Add(project);

                Notification notification = new Notification
                {
                    SenderId = admin.Id,
                    ReceiverId = recipient.Id,
                    Message = message,
                };

                _context.Notifications.Add(notification);

                await _context.SaveChangesAsync();

                var connectionId = NotificationHub.GetConnectionId(recipient.Username);
                if (connectionId != null)
                {
                    await _notificationHubContext.Clients.Client(connectionId).SendAsync("ReceiveNotification", new
                    {
                        id = notification.Id,
                        message = notification.Message,
                        createdAt = notification.CreatedAt?.ToString("o") ?? "Invalid Date",
                        sender = admin.Username,
                        recipient = recipient.Username,
                        isRead = notification.IsRead
                    });
                }


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
                    .Where(a => a.FreelancerId == userId && a.Status == "Accepted")
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

        public async Task<List<ProjectWithImageDto>> GetAllProjectsWithImageAsync()
        {
            try
            {
                return await _context.Projects
                    .Include(p => p.Images)
                    .Select(p => new ProjectWithImageDto
                    {
                        ProjectId = p.ProjectId,
                        ProjectName = p.ProjectName,
                        ProjectDescription = p.ProjectDescription,
                        Budget = p.Budget,
                        Deadline = p.Deadline,
                        SkillRequire = p.SkillRequire,
                        Status = p.Status,
                        CategoryId = p.CategoryId,
                        ImageUrls = p.Images.Select(i => i.ImageUrl).ToList()
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving projects with images", ex);
            }
        }

        public async Task<List<RevenueDto>> GetMonthlyRevenueAsync()
        {
            var projects = await _context.Projects
                .Where(p => p.Status == "Finished")
                .ToListAsync();

            var revenueData = projects
                .GroupBy(p => p.CreateAt.Month)
                .Select(g => new RevenueDto
                {
                    Month = GetMonthName(g.Key),
                    Revenue = g.Sum(p => (double)p.Budget)
                })
                .OrderBy(r => r.Month)
                .ToList();

            var allMonths = Enum.GetValues(typeof(Months)).Cast<Months>().ToList();
            var result = allMonths.Select(m =>
                revenueData.FirstOrDefault(r => r.Month == m.ToString())
                ?? new RevenueDto { Month = m.ToString(), Revenue = 0.0 }
            ).ToList();

            return result;
        }

        private string GetMonthName(int month)
        {
            return new DateTime(2024, month, 1).ToString("MMM");
        }

        public async Task<object> GetStatisticsAsync()
        {
            var today = DateTime.Today;
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var startOfYear = new DateTime(today.Year, 1, 1);

            var revenueAndProjects = await _context.Projects
                .Where(p => p.Status == "Finished")
                .GroupBy(p => 1)
                .Select(g => new
                {
                    TodayRevenue = g.Where(p => p.CreateAt.Date == today).Sum(p => p.Budget),
                    ThisWeekRevenue = g.Where(p => p.CreateAt >= startOfWeek && p.CreateAt <= today).Sum(p => p.Budget),
                    ThisMonthRevenue = g.Where(p => p.CreateAt >= startOfMonth && p.CreateAt <= today).Sum(p => p.Budget),
                    ThisYearRevenue = g.Where(p => p.CreateAt >= startOfYear && p.CreateAt <= today).Sum(p => p.Budget),
                    TodayProjects = g.Count(p => p.CreateAt.Date == today),
                    ThisWeekProjects = g.Count(p => p.CreateAt >= startOfWeek && p.CreateAt <= today),
                    ThisMonthProjects = g.Count(p => p.CreateAt >= startOfMonth && p.CreateAt <= today),
                    ThisYearProjects = g.Count(p => p.CreateAt >= startOfYear && p.CreateAt <= today)
                })
                .FirstOrDefaultAsync();

            var freelancers = await _context.Users
                .Where(u => u.Role == "Freelancer" && u.Status == "Active")
                .GroupBy(u => 1)
                .Select(g => new
                {
                    TodayFreelancers = g.Count(u => u.CreateAt.Date == today),
                    ThisWeekFreelancers = g.Count(u => u.CreateAt >= startOfWeek && u.CreateAt <= today),
                    ThisMonthFreelancers = g.Count(u => u.CreateAt >= startOfMonth && u.CreateAt <= today),
                    ThisYearFreelancers = g.Count(u => u.CreateAt >= startOfYear && u.CreateAt <= today)
                })
                .FirstOrDefaultAsync();

            var pendingContracts = await _context.Contracts
                .Where(c => c.Status == "Pending")
                .GroupBy(c => 1)
                .Select(g => new
                {
                    TodayContracts = g.Count(c => c.ContractDate.Date == today),
                    ThisWeekContracts = g.Count(c => c.ContractDate >= startOfWeek && c.ContractDate <= today),
                    ThisMonthContracts = g.Count(c => c.ContractDate >= startOfMonth && c.ContractDate <= today),
                    ThisYearContracts = g.Count(c => c.ContractDate >= startOfYear && c.ContractDate <= today)
                })
                .FirstOrDefaultAsync();

            return new
            {
                RevenueStatistics = new
                {
                    Today = revenueAndProjects?.TodayRevenue ?? 0,
                    ThisWeek = revenueAndProjects?.ThisWeekRevenue ?? 0,
                    ThisMonth = revenueAndProjects?.ThisMonthRevenue ?? 0,
                    ThisYear = revenueAndProjects?.ThisYearRevenue ?? 0
                },
                ProjectStatistics = new
                {
                    Today = revenueAndProjects?.TodayProjects ?? 0,
                    ThisWeek = revenueAndProjects?.ThisWeekProjects ?? 0,
                    ThisMonth = revenueAndProjects?.ThisMonthProjects ?? 0,
                    ThisYear = revenueAndProjects?.ThisYearProjects ?? 0
                },
                FreelancerStatistics = new
                {
                    Today = freelancers?.TodayFreelancers ?? 0,
                    ThisWeek = freelancers?.ThisWeekFreelancers ?? 0,
                    ThisMonth = freelancers?.ThisMonthFreelancers ?? 0,
                    ThisYear = freelancers?.ThisYearFreelancers ?? 0
                },
                ContractStatistics = new
                {
                    Today = pendingContracts?.TodayContracts ?? 0,
                    ThisWeek = pendingContracts?.ThisWeekContracts ?? 0,
                    ThisMonth = pendingContracts?.ThisMonthContracts ?? 0,
                    ThisYear = pendingContracts?.ThisYearContracts ?? 0
                }
            };
        }
        public async Task<List<StatusCountDto>> GetGroupedProjectStatusCountsAsync()
        {
            try
            {
                var totalProjects = await _context.Projects.CountAsync();

                if (totalProjects == 0)
                    return new List<StatusCountDto>();

                var activeAndProcessingCount = await _context.Projects
                    .Where(p => p.Status == "Active" || p.Status == "Processing")
                    .CountAsync();

                var finishedCount = await _context.Projects
                    .Where(p => p.Status == "Finished")
                    .CountAsync();

                return new List<StatusCountDto>
        {
            new StatusCountDto
            {
                Status = "Active + Processing",
                ProjectCount = activeAndProcessingCount
            },
            new StatusCountDto
            {
                Status = "Finished",
                ProjectCount = finishedCount
            }
        };
            }
            catch (Exception ex)
            {
                throw new Exception("Error calculating grouped project status counts", ex);
            }
        }
    }
}