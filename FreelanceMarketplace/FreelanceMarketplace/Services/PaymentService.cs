using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public PaymentService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        // Kiểm tra số dư và thực hiện thanh toán
        public async Task<Payment> CreatePaymentAsync(Payment payment)
        {
            try
            {
                // Kiểm tra số dư tài khoản
                var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == payment.UserId);
                if (wallet == null || wallet.Balance < payment.Amount)
                {
                    throw new InvalidOperationException("Insufficient balance for this payment.");
                }

                // Thực hiện thanh toán
                _context.Payments.Add(payment);
                wallet.Balance -= payment.Amount; // Giảm số dư trong ví
                await _context.SaveChangesAsync();

                // Gửi thông báo thành công
                await _notificationService.CreateNotificationAsync(new Notification
                {
                    SenderId = payment.UserId,
                    Message = "Payment successful.",
                    CreatedAt = DateTime.UtcNow
                });

                return payment;
            }
            catch (Exception ex)
            {
                // Gửi thông báo thất bại
                await _notificationService.CreateNotificationAsync(new Notification
                {
                    SenderId = payment.UserId,
                    Message = "Payment failed: " + ex.Message,
                    CreatedAt = DateTime.UtcNow
                });
                throw new Exception("Error creating payment", ex);
            }
        }

        // Xử lý hoàn tiền
        public async Task<Payment?> RefundPaymentAsync(int paymentId)
        {
            try
            {
                var payment = await _context.Payments.FindAsync(paymentId);
                if (payment == null)
                    throw new KeyNotFoundException("Payment not found");

                // Tìm ví của người dùng để hoàn tiền
                var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == payment.UserId);
                if (wallet == null)
                    throw new InvalidOperationException("User wallet not found.");

                // Thực hiện hoàn tiền
                wallet.Balance += payment.Amount;
                payment.Status = "Refunded"; // Cập nhật trạng thái thanh toán

                _context.Payments.Update(payment);
                await _context.SaveChangesAsync();

                // Gửi thông báo hoàn tiền thành công
                await _notificationService.CreateNotificationAsync(new Notification
                {
                    SenderId = payment.UserId,
                    Message = $"Payment of {payment.Amount} has been refunded.",
                    CreatedAt = DateTime.UtcNow
                });

                return payment;
            }
            catch (Exception ex)
            {
                throw new Exception("Error processing refund", ex);
            }
        }

        // Lấy tất cả lịch sử thanh toán
        public async Task<List<Payment>> GetAllPaymentsAsync()
        {
            try
            {
                return await _context.Payments
                    .Include(p => p.Contract)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving payments", ex);
            }
        }

        // Lấy thông tin thanh toán theo ID
        public async Task<Payment> GetPaymentByIdAsync(int paymentId)
        {
            try
            {
                var payment = await _context.Payments
                    .Include(p => p.Contract)
                    .FirstOrDefaultAsync(p => p.PaymentId == paymentId);

                if (payment == null)
                    throw new KeyNotFoundException("Payment not found");

                return payment;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving payment with ID {paymentId}", ex);
            }
        }

        // Xóa thanh toán
        public async Task<bool> DetetePaymentAsync(int paymentId)
        {
            try
            {
                var payment = await _context.Payments.FindAsync(paymentId);
                if (payment == null)
                {
                    throw new KeyNotFoundException("Payment not found");
                }
                _context.Payments.Remove(payment);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting payment", ex);
            }
        }

        // Cập nhật thanh toán
        public async Task<Payment?> UpdatePaymentAsync(int paymentId, Payment payment)
        {
            try
            {
                var existingPayment = await _context.Payments.FindAsync(payment.PaymentId);
                if (existingPayment == null)
                    throw new KeyNotFoundException("Payment not found");

                existingPayment.ContractId = payment.ContractId;
                existingPayment.Amount = payment.Amount;
                existingPayment.Description = payment.Description;
                existingPayment.Status = payment.Status;

                _context.Payments.Update(existingPayment);
                await _context.SaveChangesAsync();
                return existingPayment;
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating payment", ex);
            }
        }
    }
}

