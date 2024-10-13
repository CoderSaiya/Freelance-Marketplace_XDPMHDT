using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using FreelanceMarketplace.GraphQL.Authorization;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class ContractQuery : ObjectGraphType
    {
        public ContractQuery(IServiceProvider serviceProvider)
        {
            AddField(new FieldType
            {
                Name = "contracts",
                Type = typeof(ListGraphType<ContractType>),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var contractService = scope.ServiceProvider.GetRequiredService<IContractService>();
                    return await contractService.GetAllContractsAsync();
                })
            }.AuthorizeWith("Admin"));

            AddField(new FieldType
            {
                Name = "contractById",
                Type = typeof(ContractType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "contractId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    int contractId = context.GetArgument<int>("contractId");
                    using var scope = serviceProvider.CreateScope();
                    var contractService = scope.ServiceProvider.GetRequiredService<IContractService>();
                    return await contractService.GetContractByIdAsync(contractId);
                })
            }.AuthorizeWith("Admin", "Client", "Freelancer"));
        }
    }
}
