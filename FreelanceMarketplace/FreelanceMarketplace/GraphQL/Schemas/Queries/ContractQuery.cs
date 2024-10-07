using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class ContractQuery : ObjectGraphType
    {
        public ContractQuery(IServiceProvider serviceProvider)
        {
            Field<ListGraphType<ContractType>>("contracts")
                .ResolveAsync(async context =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var contractService = scope.ServiceProvider.GetRequiredService<IContractService>();
                    return await contractService.GetAllContractsAsync();
                });

            Field<ContractType>("contractById")
                .Arguments(new QueryArguments(new QueryArgument<IntGraphType> { Name = "contractId" }))
                .ResolveAsync(async context =>
                {
                    int contractId = context.GetArgument<int>("contractId");
                    using var scope = serviceProvider.CreateScope();
                    var contractService = scope.ServiceProvider.GetRequiredService<IContractService>();
                    return await contractService.GetContractByIdAsync(contractId);
                });
        }
    }
}
