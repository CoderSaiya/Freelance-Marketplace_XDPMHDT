using FreelanceMarketplace.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IApplyService
    {
        Task<Apply> CreateApplyAsync(Apply apply);
        Task<Apply> GetApplyByIdAsync(int applyId);
        Task<IEnumerable<Apply>> GetAppliesForProjectAsync(int projectId);
        Task<Apply> UpdateApplyAsync(Apply apply);
        Task<bool> DeleteApplyAsync(int applyId);
    }
}
