using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL.Types;
using GraphQL;
using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class UserMutation : ObjectGraphType
    {
        public UserMutation(IUserService userService)
        {
            
        }
    }
}
