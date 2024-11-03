using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IWalletService
    {
        Task<Wallet> GetWalletByUserIdAsync(int userId);
        Task<Wallet> UpdateWalletBalanceAsync(int userId, int amount);
    }
}
