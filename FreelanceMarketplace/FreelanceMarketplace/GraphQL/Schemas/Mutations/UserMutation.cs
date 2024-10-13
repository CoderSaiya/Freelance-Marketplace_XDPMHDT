using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL.Types;
using GraphQL;
using FreelanceMarketplace.Models;
using GraphQL.Resolvers;
using FreelanceMarketplace.GraphQL.Authorization;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class UserMutation : ObjectGraphType
    {
        public UserMutation(IServiceProvider serviceProvider)
        {
            AddField(new FieldType
            {
                Name = "deleteUser",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }
            ),
                Resolver = new FuncFieldResolver<bool>(context =>
                {
                    var userService = serviceProvider.GetRequiredService<IUserService>();
                    int userId = context.GetArgument<int>("userId");
                    return userService.DeleteUserById(userId);
                })
            }).AuthorizeWith("Admin");
        }
    }
}
