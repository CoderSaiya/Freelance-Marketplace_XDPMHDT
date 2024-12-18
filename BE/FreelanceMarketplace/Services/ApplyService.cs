using FreelanceMarketplace.Data;
using FreelanceMarketplace.Hubs;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Cms;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static GraphQL.Validation.Rules.OverlappingFieldsCanBeMerged;

namespace FreelanceMarketplace.Services
{
    public class ApplyService : IApplyService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public ApplyService(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _notificationHubContext = hubContext;
        }

        public async Task<Apply> CreateApplyAsync(Apply apply)
        {
            try
            {
                await _context.Applies.AddAsync(apply);
                await _context.SaveChangesAsync();
                return apply;
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating apply", ex);
            }
        }

        public async Task<List<Apply>> GetApplyAsync()
        {
            try
            {
                return await _context.Applies
                    .Include(a => a.Freelancer)
                        .ThenInclude(f => f.UserProfile)
                    .Include(a => a.Client)
                        .ThenInclude(f => f.UserProfile)
                    .Include(a => a.Project)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving apply list", ex);
            }
        }

        public async Task<List<Apply>> GetApplyByFreelancerIdAsync(int freelancerId)
        {
            try
            {
                return await _context.Applies
                    .Include(a => a.Freelancer)
                        .ThenInclude(f => f.UserProfile)
                    .Include(a => a.Client)
                        .ThenInclude(f => f.UserProfile)
                    .Include(a => a.Project)
                        .ThenInclude(p => p.Users)
                    .Where(a => a.FreelancerId == freelancerId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving apply list", ex);
            }
        }

        public async Task<Apply> GetApplyByIdAsync(int applyId)
        {
            try
            {
                return await _context.Applies
                    .Include(a => a.Freelancer)
                    .Include(a => a.Client)
                    .Include(a => a.Project)
                    .SingleOrDefaultAsync(a => a.ApplyId == applyId);
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
                    .Include(a => a.Freelancer)
                    .Include(a => a.Client)
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

        public async Task<bool> HasFreelancerAppliedForProjectAsync(int freelancerId, int projectId)
        {
            var application = await _context.Applies
                .FirstOrDefaultAsync(a => a.FreelancerId == freelancerId && a.ProjectId == projectId);

            return application != null;
        }

        public async Task<bool> AcceptApply(int applyId)
        {
            try
            {
                var existingApply = await _context.Applies.FirstOrDefaultAsync(a => a.ApplyId == applyId);
                if (existingApply == null)
                    throw new KeyNotFoundException("Apply not found");
                existingApply.Status = "Accepted";

                var project = _context.Projects.FirstOrDefault(a => a.ProjectId == existingApply.ProjectId);
                project.Status = "Processing";

                Users admin = await _context.Users.FirstOrDefaultAsync(u => u.Username == "admin");
                Users acceptedFreelancer = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingApply.FreelancerId);

                var acceptMessage = "Congratulations your application to project #1 has been accepted!!";
                var rejectMessage = "Sorry your application to project #1 was rejected!! Please try again later.";

                var newContract = new Contracts
                {
                    ProjectId = existingApply.ProjectId,
                    FreelancerId = existingApply.FreelancerId,
                    ClientId = existingApply.ClientId,
                    EndDate = DateTime.Now.AddDays(existingApply.Duration),
                    PaymentAmount = project.Budget,
                };


                await _context.Contracts.AddAsync(newContract);

                Notification acceptNotification = new Notification
                {
                    SenderId = admin.Id,
                    ReceiverId = acceptedFreelancer.Id,
                    Message = acceptMessage,
                };

                _context.Notifications.Add(acceptNotification);

                await _context.SaveChangesAsync();

                var connectionId = NotificationHub.GetConnectionId(acceptedFreelancer.Username);
                if (connectionId != null)
                {
                    await _notificationHubContext.Clients.Client(connectionId).SendAsync("ReceiveNotification", new
                    {
                        id = acceptNotification.Id,
                        message = acceptNotification.Message,
                        createdAt = acceptNotification.CreatedAt?.ToString("o") ?? "Invalid Date",
                        sender = admin.Username,
                        recipient = acceptedFreelancer.Username,
                        isRead = acceptNotification.IsRead
                    });
                }

                Users rejectedFreelancer = new Users();

                var otherApplies = await _context.Applies
                    .Where(a => a.ProjectId == existingApply.ProjectId && a.ApplyId != applyId)
                    .ToListAsync();

                foreach (var apply in otherApplies)
                {
                    rejectedFreelancer = await _context.Users.FirstOrDefaultAsync(u => u.Id == apply.FreelancerId);

                    Notification rejectNotification = new Notification
                    {
                        SenderId = admin.Id,
                        ReceiverId = rejectedFreelancer.Id,
                        Message = rejectMessage,
                    };

                    _context.Notifications.Add(acceptNotification);

                    var connectionId2 = NotificationHub.GetConnectionId(rejectedFreelancer.Username);
                    if (connectionId2 != null)
                    {
                        await _notificationHubContext.Clients.Client(connectionId2).SendAsync("ReceiveNotification", new
                        {
                            id = rejectNotification.Id,
                            message = rejectNotification.Message,
                            createdAt = rejectNotification.CreatedAt?.ToString("o") ?? "Invalid Date",
                            sender = admin.Username,
                            recipient = rejectedFreelancer.Username,
                            isRead = rejectNotification.IsRead
                        });
                    }
                    apply.Status = "Rejected";
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating apply", ex);
            }
        }
    }
}
