using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class WalletQuery : ObjectGraphType
    {
        public WalletQuery(IServiceProvider serviceProvider)
        {
            Field<WalletType>("getWallet")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }))
            .ResolveAsync(async context =>
            {
                var userId = context.GetArgument<int>("userId");
                using (var scope = serviceProvider.CreateScope())
                {
                    var walletService = scope.ServiceProvider.GetRequiredService<IWalletService>();
                    return await walletService.GetWalletByUserIdAsync(userId);
                }
            });
        }
    }
}
