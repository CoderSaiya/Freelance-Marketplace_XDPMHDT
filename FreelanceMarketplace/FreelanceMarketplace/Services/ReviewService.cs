using FreelanceMarketplace.Data;
using FreelanceMarketplace.Hubs;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Cms;
using System.Linq.Expressions;
using static GraphQL.Validation.Rules.OverlappingFieldsCanBeMerged;

namespace FreelanceMarketplace.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public ReviewService(AppDbContext context, IHubContext<NotificationHub> notificationHub)
        {
            _context = context;
            _notificationHubContext = notificationHub;
        }

        public async Task<List<Review>> GetAllReviewsAsync()
        {
            try
            {
                return await _context.Reviews
                    .Include(c => c.Sender)
                    .Include(c => c.Recipient)
                    .Include(c => c.Contract)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving reviews", ex);

            }
        }

        public async Task<Review> GetReviewByIdAsync(int reviewId)
        {
            try
            {
                var review = await _context.Reviews
                    .Include(c => c.Sender)
                    .Include(c => c.Recipient)
                    .Include(c => c.Contract)
                    .FirstOrDefaultAsync(c => c.ReviewId == reviewId);

                if (review == null)
                    throw new KeyNotFoundException("Review not found");
                return review;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving review with ID {reviewId}", ex);
            }

        }

        public async Task<Review> CreateReviewAsync(Review review)
        {
            try
            {
                Users admin = _context.Users.FirstOrDefault(u => u.Username == "admin");
                Users recipient = _context.Users.FirstOrDefault(u => u.Id == review.RecipientId);
                Users sender = _context.Users.FirstOrDefault(u => u.Id == review.SenderId);
                if (admin == null || recipient == null || sender == null)
                {
                    throw new Exception("Admin or user not found.");
                }
                var message = $"You has new review!!";

                _context.Reviews.Add(review);

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

                Console.WriteLine("recipient ID: " + recipient.Id);

                var newRating = _context.Reviews
                                .Where(r => r.RecipientId == recipient.Id)
                                .Select(r => r.Rating)
                                .DefaultIfEmpty(0)
                                .Average();

                Console.WriteLine("Rating: " + newRating);

                if (recipient.UserProfile != null)
                {
                    recipient.UserProfile.Rating = newRating;
                    _context.UserProfiles.Update(recipient.UserProfile);
                }

                await _context.SaveChangesAsync();
                return review;
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating review", ex);
            }
        }

        //public async Task<Review?> UpdateReviewAsync(int reviewId, Review review)
        //{
        //    try
        //    {
        //        Users admin = _context.Users.FirstOrDefault(u => u.Username == "admin");

        //        if (admin == null)
        //        {
        //            throw new Exception("Admin is on vacation =))");
        //        }


        //        var existingReview = await _context.Reviews.FindAsync(review.ReviewId);
        //        if (existingReview == null)
        //        {
        //            throw new KeyNotFoundException("Review not found");
        //        }

        //        existingReview.UserId = review.UserId;
        //        existingReview.ContractId = review.ContractId;
        //        existingReview.Rating = review.Rating;
        //        existingReview.Feedback = review.Feedback;

        //        _context.Reviews.Update(existingReview);
        //        await _context.SaveChangesAsync();

        //        await _notificationHubContext.Clients.User(recipient.Id.ToString())
        //            .SendAsync("ReceiveNotification", new
        //            {
        //                id = notification.Id,
        //                message = notification.Message,
        //                createdAt = notification.CreatedAt,
        //                sender = admin.Username,
        //                recipient = recipient.Username,
        //                isRead = notification.IsRead
        //            });

        //        await _context.SaveChangesAsync();

        //        return existingReview;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception("Error updating review", ex);
        //    }
        //}

        public async Task<bool> DeleteReviewAsync(int reviewId)
        {
            try
            {
                var review = await _context.Reviews.FindAsync(reviewId);
                if (review == null)
                {
                    throw new KeyNotFoundException("Review not found");
                }
                _context.Reviews.Remove(review);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting review", ex);
            }
        }

        public async Task<bool> CheckReviewed(int projectId, int userId)
        {
            var reviewExists = await _context.Reviews
                .AnyAsync(r => r.Contract.ProjectId == projectId && r.SenderId == userId);

            return reviewExists;
        }

        public async Task<List<Review>> GetReviewsSortedByRatingAsync(bool ascending = false)
        {
            try
            {
                var query = _context.Reviews
                    .Include(c => c.SenderId)  // Bao gồm thông tin người dùng đã đánh giá
                    .Include(c => c.Contract);  // Bao gồm thông tin hợp đồng liên quan

                if (ascending)
                {
                    return await query.OrderBy(r => r.Rating).ToListAsync();  // Sắp xếp theo thứ tự tăng dần
                }
                else
                {
                    return await query.OrderByDescending(r => r.Rating).ToListAsync();  // Sắp xếp theo thứ tự giảm dần
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving sorted reviews", ex);
            }
        }
        public string GetRatingStatus(double rating)
        {
            if (rating >= 4)
            {
                return "Tốt";
            }
            else if (rating >= 3 && rating < 4)
            {
                return "Trung bình";
            }
            else
            {
                return "Kém";
            }
        }
    }
}