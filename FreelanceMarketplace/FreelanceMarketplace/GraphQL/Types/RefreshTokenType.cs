using FreelanceMarketplace.Models;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class RefreshTokenType : ObjectGraphType<RefreshTokens>
    {
        public RefreshTokenType()
        {
            Field(x => x.Id);
            Field(x => x.Token);
            Field(x => x.ExpiryDate);
            Field(x => x.IsUsed);
            Field(x => x.IsRevoked);
        }
    }
}
