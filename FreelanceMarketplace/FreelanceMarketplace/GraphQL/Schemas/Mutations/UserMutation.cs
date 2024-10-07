using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL.Types;
using GraphQL;
using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class UserMutation : ObjectGraphType
    {
        public UserMutation(IServiceProvider serviceProvider)
        {
            Field<BooleanGraphType>("deleteUser")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }
                ))
                .Resolve(context =>
                {
                    var userService = serviceProvider.GetRequiredService<IUserService>();
                    int userId = context.GetArgument<int>("userId");
                    return userService.DeleteUserById(userId);
                });
        }
    }
}
