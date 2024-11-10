using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IContractService
    {
        Task<List<Contracts>> GetAllContractsAsync();
        Task<Contracts?> GetContractByIdAsync(int contractId);
        Task<Contracts> GetContractByProject(int projectId);
        Task<Contracts?> CreateContractAsync(Contracts contract);
        Task<Contracts?> UpdateContractAsync(int contractId, Contracts contract);
        Task<Contracts> UpdateURLFileContractAsync(int freelanceId, int projectId, string url);
        Task<bool> DeleteContractAsync(int contractId);
    }
}
