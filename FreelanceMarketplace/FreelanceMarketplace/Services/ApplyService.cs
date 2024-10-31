using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FreelanceMarketplace.Services.Implementations
{
    public class ApplyService : IApplyService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;
        private const int MaxAppliesPerProject = 10;

        public ApplyService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<Apply> CreateApplyAsync(Apply apply)
        {
            try
            {
                var project = await _context.Projects.FindAsync(apply.ProjectId);
                if (project == null || project.Status != "Open")
                {
                    throw new InvalidOperationException("The project is not open for applications.");
                }

                var applyCount = await _context.Applies
                    .CountAsync(a => a.ProjectId == apply.ProjectId);
                if (applyCount >= MaxAppliesPerProject)
                {
                    throw new InvalidOperationException("The maximum number of applications for this project has been reached.");
                }

                await _context.Applies.AddAsync(apply);
                await _context.SaveChangesAsync();

                await SendNotificationAsync(apply.UserId, "Your application has been submitted successfully.");

                return apply;
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating application", ex);
            }
        }

        public async Task<Apply?> GetApplyByIdAsync(int applyId)
        {
            try
            {
                return await _context.Applies
                    .Include(a => a.User)
                    .Include(a => a.Project)
                    .SingleOrDefaultAsync(a => a.ApplyId == applyId)
                    ?? throw new Exception($"Application with ID {applyId} not found");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving application with ID {applyId}", ex);
            }
        }

        public async Task<IEnumerable<Apply>> GetAppliesForProjectAsync(int projectId)
        {
            try
            {
                return await _context.Applies
                    .Include(a => a.User)
                    .Where(a => a.ProjectId == projectId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving applications for project with ID {projectId}", ex);
            }
        }

        public async Task<Apply> UpdateApplyAsync(Apply apply)
        {
            try
            {
                var existingApply = await _context.Applies.FindAsync(apply.ApplyId);
                if (existingApply == null)
                    throw new KeyNotFoundException("Application not found");

                _context.Entry(existingApply).CurrentValues.SetValues(apply);
                await _context.SaveChangesAsync();

                var message = apply.Status == "Accepted"
                    ? "Your application has been accepted."
                    : "Your application has been rejected.";
                await SendNotificationAsync(apply.UserId, message);

                return existingApply;
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating application", ex);
            }
        }

        public async Task<bool> DeleteApplyAsync(int applyId)
        {
            try
            {
                var apply = await _context.Applies.FindAsync(applyId);
                if (apply == null) return false;

                _context.Applies.Remove(apply);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting application", ex);
            }
        }

        public async Task SendNotificationAsync(int userId, string message)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationService.CreateNotificationAsync(notification);
        }
    }
}
