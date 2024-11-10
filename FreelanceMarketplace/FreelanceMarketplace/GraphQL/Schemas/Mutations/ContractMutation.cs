using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using FreelanceMarketplace.GraphQL.Authorization;
using Microsoft.Extensions.DependencyInjection;

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

            AddField(new FieldType
            {
                Name = "updateURLFileContract",
                Type = typeof(ContractType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "freelanceId" },
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "projectId" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "url" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var contractId = context.GetArgument<int>("freelanceId");
                    var projectId = context.GetArgument<int>("projectId");
                    var url = context.GetArgument<string>("url");
                    return await contractService.UpdateURLFileContractAsync(contractId, projectId, url);
                })
            }.AuthorizeWith("Freelancer"));

            AddField(new FieldType
            {
                Name = "contractByProjectId",
                Type = typeof(ContractType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "projectId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    int projectId = context.GetArgument<int>("projectId");
                    return await contractService.GetContractByProject(projectId);
                })
            }.AuthorizeWith("Admin", "Client", "Freelancer"));
        }
    }
}
