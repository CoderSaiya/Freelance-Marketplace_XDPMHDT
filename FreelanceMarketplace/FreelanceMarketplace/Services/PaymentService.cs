using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Services

{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;

        public PaymentService(AppDbContext context)
        {
            _context = context;
        }

            public async Task<Payment> CreatePaymentAsync(Payment payment)
        {
            try
            {
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();
                return payment;
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating payment", ex);
            }
        }

        public async Task DetetePaymentAsync(int paymentId)
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
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting payment", ex);
            }
        }

        public async Task<List<Payment>> GetAllPaymentsAsync()
        {
            try
            {
                return await _context.Payments
                    .Include(p =>p.Contract)
                    .ToListAsync();
            }
            catch(Exception ex)
            {
                throw new Exception("Error retrieving payments ", ex);
            }
        }

        public async Task<Payment> GetPaymentByIdAsync(int paymentId)
        {
            try
            {
                var payment = await _context.Payments
                    .Include (p =>p.Contract)
                    .FirstOrDefaultAsync(p=>p.PaymentId== paymentId);

                if (payment == null)
                    throw new KeyNotFoundException("Payment not found");
                return payment;
            }
            catch(Exception ex)
            {
                throw new Exception($"Error retrieving payment with ID {paymentId}", ex);

            }

        }

        public async Task UpdatePaymentAsync(Payment payment)
        {
            try
            {
                var existingPayment = await _context.Payments.FindAsync(payment.PaymentId);
                if (existingPayment == null)
                    throw new KeyNotFoundException("Paymant not found");

                existingPayment.ContractId= payment.ContractId;
                existingPayment.Amount = payment.Amount;
                existingPayment.Description= payment.Description;
                existingPayment.Status= payment.Status;

                _context.Payments.Update(existingPayment);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating payment", ex);
            }
        }
    }
}
