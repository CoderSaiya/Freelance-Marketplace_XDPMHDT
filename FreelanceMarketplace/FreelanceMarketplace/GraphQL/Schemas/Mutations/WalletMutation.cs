using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class WalletMutation : ObjectGraphType
    {
        public WalletMutation(IWalletService walletService)
        {
            Field<WalletType>("updateWalletBalance")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" },
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "amount" }
                ))
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var amount = context.GetArgument<int>("amount");
                    return await walletService.UpdateWalletBalanceAsync(userId, amount);
                });
        }
    }
}
