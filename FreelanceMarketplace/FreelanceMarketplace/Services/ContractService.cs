﻿using FreelanceMarketplace.Data;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Services
{
    public class ContractService : IContractService
    {
        private readonly AppDbContext _context;

        public ContractService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Contracts>> GetAllContractsAsync()
        {
            return await _context.Contracts
                .Include(c => c.Freelancer)
                .Include(c => c.Client)
                .Include(c => c.Project)
                .Include(c => c.Payment)
                .Include(c => c.Reviews)
                .ToListAsync();
        }

        public async Task<Contracts?> GetContractByIdAsync(int contractId)
        {
            return await _context.Contracts
                .Include(c => c.Freelancer)
                .Include(c => c.Client)
                .Include(c => c.Project)
                .Include(c => c.Payment)
                .Include(c => c.Reviews)
                .FirstOrDefaultAsync(c => c.ContractId == contractId);
        }

        public async Task<Contracts> GetContractByProject(int projectId)
        {
            return await _context.Contracts
                .Include(c => c.Freelancer)
                .Include(c => c.Client)
                .Include(c => c.Project)
                .Include(c => c.Payment)
                .Include(c => c.Reviews)
                .FirstOrDefaultAsync(c => c.ProjectId == projectId);
        }

        public async Task<Contracts?> CreateContractAsync(Contracts contract)
        {
            var client = await _context.Users.FindAsync(contract.ClientId);
            var freelancer = await _context.Users.FindAsync(contract.FreelancerId);
            if (client == null || freelancer == null)
            {
                return null;
            }

            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();
            return contract;
        }

        public async Task<Contracts?> UpdateContractAsync(int contractId, Contracts contract)
        {
            try
            {
                var existingContract = await _context.Contracts.FindAsync(contractId);
                if (existingContract == null)
                    throw new KeyNotFoundException("Contract not found");

                // cap nhat cac fields
                existingContract.ProjectId = contract.ProjectId;
                existingContract.FreelancerId = contract.FreelancerId;
                existingContract.ClientId = contract.ClientId;
                existingContract.EndDate = contract.EndDate;
                existingContract.PaymentAmount = contract.PaymentAmount;
                existingContract.Status = contract.Status;

                _context.Contracts.Update(existingContract);
                await _context.SaveChangesAsync();

                return existingContract;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating contract with ID {contractId}", ex);
            }
        }

        public async Task<Contracts> UpdateURLFileContractAsync(int freelanceId, int projectId, string url)
        {
            try
            {
                var existingContract = await _context.Contracts
                    .SingleOrDefaultAsync(c => c.ProjectId == projectId && c.FreelancerId == freelanceId);
                if (existingContract == null)
                    throw new KeyNotFoundException("Contract not found");

                existingContract.FilePath = url;

                _context.Contracts.Update(existingContract);
                await _context.SaveChangesAsync();

                return existingContract;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating contract with freelance ID {freelanceId} and project ID {projectId}", ex);
            }
        }

        public async Task<bool> DeleteContractAsync(int contractId)
        {
            try
            {
                var contract = await _context.Contracts.FindAsync(contractId);
                if (contract == null)
                    throw new KeyNotFoundException("Contract not found");

                _context.Contracts.Remove(contract);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting contract with ID {contractId}", ex);
            }
        }

        public async Task UpdateContractStatusAsync(int contractId, string newStatus)
        {
            var contract = await _context.Contracts.FindAsync(contractId);
            if (contract == null)
                throw new KeyNotFoundException("Contract not found.");

            contract.Status = newStatus;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> FinishedProject(int contractId)
        {
            var contract = await _context.Contracts.FindAsync(contractId);
            if (contract == null)
                return false;

            contract.Status = "Finished";
            contract.EndDate = DateTime.Now;

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == contract.ProjectId);
            if (project == null)
                return false;
            project.Status = "Finished";

            await _context.SaveChangesAsync();
            return true;
        }
    }

}
