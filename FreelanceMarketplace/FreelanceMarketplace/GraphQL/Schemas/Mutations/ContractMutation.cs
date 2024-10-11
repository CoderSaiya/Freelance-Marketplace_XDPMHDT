using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using FreelanceMarketplace.GraphQL.Authorization;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class ContractMutation : ObjectGraphType
    {
        public ContractMutation(IContractService contractService)
        {
            AddField(new FieldType
            {
                Name = "createContract",
                Type = typeof(ContractType),
                Arguments = new QueryArguments(
                new QueryArgument<NonNullGraphType<ContractInputType>> { Name = "contract" }
            ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var input = context.GetArgument<Contracts>("contract");
                    return await contractService.CreateContractAsync(input);
                })
            }.AuthorizeWith("Client", "Admin"));

            AddField(new FieldType
            {
                Name = "updateContract",
                Type = typeof(ContractType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "contractId" },
                    new QueryArgument<NonNullGraphType<ContractInputType>> { Name = "contract" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var contractId = context.GetArgument<int>("contractId");
                    var input = context.GetArgument<Contracts>("contract");
                    return await contractService.UpdateContractAsync(contractId, input);
                })
            }.AuthorizeWith("Admin"));

            AddField(new FieldType
            {
                Name = "deleteContract",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "contractId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var contractId = context.GetArgument<int>("contractId");
                    return await contractService.DeleteContractAsync(contractId);
                })
            }.AuthorizeWith("Admin"));
        }
    }
}
