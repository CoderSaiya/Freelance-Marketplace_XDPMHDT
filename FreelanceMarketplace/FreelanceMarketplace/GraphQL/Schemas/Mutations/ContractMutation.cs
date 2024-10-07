using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class ContractMutation : ObjectGraphType
    {
        public ContractMutation(IContractService contractService)
        {
            Field<ContractType>("createContract")
                .Argument<NonNullGraphType<ContractInputType>>("contract")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<Contracts>("contract");
                    return await contractService.CreateContractAsync(input);
                });

            Field<ContractType>("updateContract")
                .Argument<NonNullGraphType<IntGraphType>>("contractId")
                .Argument<NonNullGraphType<ContractInputType>>("contract")
                .ResolveAsync(async context =>
                {
                    var contractId = context.GetArgument<int>("contractId");
                    var input = context.GetArgument<Contracts>("contract");
                    return await contractService.UpdateContractAsync(contractId, input);
                });

            Field<BooleanGraphType>("deleteContract")
                .Argument<NonNullGraphType<IntGraphType>>("contractId")
                .ResolveAsync(async context =>
                {
                    var contractId = context.GetArgument<int>("contractId");
                    return await contractService.DeleteContractAsync(contractId);
                });
        }
    }
}
