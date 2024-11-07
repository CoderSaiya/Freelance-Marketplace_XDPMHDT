using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class WalletQuery : ObjectGraphType
    {
        public WalletQuery(IWalletService walletService)
        {
            Field<WalletType>("wallet")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }))
            .ResolveAsync(async context =>
            {
                var userId = context.GetArgument<int>("userId");
                return await walletService.GetWalletByUserIdAsync(userId);
            });
        }
    }
}
