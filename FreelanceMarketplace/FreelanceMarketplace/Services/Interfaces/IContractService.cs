using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IContractService
    {
        Task<List<Contracts>> GetAllContractsAsync();
        Task<Contracts?> GetContractByIdAsync(int contractId);
        Task<Contracts> CreateContractAsync(Contracts contract);
        Task<Contracts?> UpdateContractAsync(int contractId, Contracts contract);
        Task<bool> DeleteContractAsync(int contractId);
    }
}
