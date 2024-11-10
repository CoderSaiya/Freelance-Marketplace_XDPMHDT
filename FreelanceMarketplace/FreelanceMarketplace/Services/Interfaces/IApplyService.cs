using FreelanceMarketplace.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FreelanceMarketplace.Services.Interfaces
{
    public interface IApplyService
    {
        Task<List<Apply>> GetApplyAsync();
        Task<List<Apply>> GetApplyByFreelancerIdAsync(int freelancerId);
        Task<Apply> CreateApplyAsync(Apply apply);
        Task<Apply> GetApplyByIdAsync(int applyId);
        Task<IEnumerable<Apply>> GetAppliesForProjectAsync(int projectId);
        Task<Apply> UpdateApplyAsync(Apply apply);
        Task<bool> DeleteApplyAsync(int applyId);
        Task<bool> HasFreelancerAppliedForProjectAsync(int freelancerId, int projectId);
        Task<bool> AcceptApply(int applyId);
    }
}
