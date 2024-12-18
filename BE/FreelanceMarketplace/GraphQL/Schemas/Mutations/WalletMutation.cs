using FreelanceMarketplace.GraphQL.Authorization;
using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class WalletMutation : ObjectGraphType
    {
        public WalletMutation(IWalletService walletService)
        {
            AddField(new FieldType
            {
                Name = "updateWalletBalance",
                Type = typeof(WalletType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" },
                    new QueryArgument<NonNullGraphType<DecimalGraphType>> { Name = "amount" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var amount = context.GetArgument<decimal>("amount");
                    return await walletService.UpdateWalletBalanceAsync(userId, amount);
                })
            }.AuthorizeWith("Freelancer", "Client", "Admin"));
        }
    }
}
