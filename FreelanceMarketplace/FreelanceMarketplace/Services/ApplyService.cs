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
                    throw new InvalidOperationException("Dự án không mở để apply.");
                }

                var applyCount = await _context.Applies
                    .CountAsync(a => a.ProjectId == apply.ProjectId);
                if (applyCount >= MaxAppliesPerProject)
                {
                    throw new InvalidOperationException("Đã đạt số lượng apply tối đa cho dự án này.");
                }

                await _context.Applies.AddAsync(apply);
                await _context.SaveChangesAsync();

                await SendNotificationAsync(apply.UserId, "Apply của bạn đã được gửi thành công.");

                return apply;
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating apply", ex);
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
                    ?? throw new Exception($"Apply với ID {applyId} không tìm thấy");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving apply with ID {applyId}", ex);
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
                throw new Exception($"Error retrieving applies for project with ID {projectId}", ex);
            }
        }

        public async Task<Apply> UpdateApplyAsync(Apply apply)
        {
            try
            {
                var existingApply = await _context.Applies.FindAsync(apply.ApplyId);
                if (existingApply == null)
                    throw new KeyNotFoundException("Apply not found");

                _context.Entry(existingApply).CurrentValues.SetValues(apply);
                await _context.SaveChangesAsync();

                var message = apply.Status == "Accepted"
                    ? "Apply của bạn đã được chấp nhận."
                    : "Apply của bạn đã bị từ chối.";
                await SendNotificationAsync(apply.UserId, message);

                return existingApply;
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating apply", ex);
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
                throw new Exception("Error deleting apply", ex);
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
