using FreelanceMarketplace.Models;
using GraphQL.Types;
using System;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class WalletType : ObjectGraphType<Wallet>
    {
        public WalletType()
        {
            Field(x => x.WalletId);
            Field(x => x.UserId);
            Field(x => x.Balance);
            Field<UserType>("user").Resolve(context => context.Source.User);
        }
    }
}
