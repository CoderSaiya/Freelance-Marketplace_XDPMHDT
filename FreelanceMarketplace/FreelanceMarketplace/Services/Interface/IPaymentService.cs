using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.Services.Interface
{
    public interface IPaymentService
    {
        Task<List<Payment>> GetAllPaymentsAsync();
        Task<Payment> GetPaymentByIdAsync(int paymentId);
        Task<Payment> CreatePaymentAsync(Payment payment);
        Task<Payment?> UpdatePaymentAsync(int paymentId, Payment payment);

        Task <bool> DetetePaymentAsync(int paymentId);

    }
}
