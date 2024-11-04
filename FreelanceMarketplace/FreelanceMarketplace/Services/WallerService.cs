using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Services
{
    public class WalletService : IWalletService
    {
        private readonly AppDbContext _context;

        public WalletService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Wallet> GetWalletByUserIdAsync(int userId)
        {
            return await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        }

        public async Task<Wallet> UpdateWalletBalanceAsync(int userId, decimal amount)
        {
            var wallet = await _context.Wallets.FindAsync(userId);
            if (wallet != null)
            {
                wallet.Balance = (wallet.Balance ?? 0) + amount;
                await _context.SaveChangesAsync();
            }
            return wallet;
        }
    }
}
