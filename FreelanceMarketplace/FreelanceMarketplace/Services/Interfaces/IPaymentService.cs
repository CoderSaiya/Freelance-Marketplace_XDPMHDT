using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<List<Payment>> GetAllPaymentsAsync();
        Task<Payment> GetPaymentByIdAsync(int paymentId);
        Task<Payment> CreatePaymentAsync(Payment payment);
        Task<Payment?> UpdatePaymentAsync(int paymentId, Payment payment);

        Task<bool> DetetePaymentAsync(int paymentId);

        Task<Payment?> RefundPaymentAsync(int paymentId);


    }
}
