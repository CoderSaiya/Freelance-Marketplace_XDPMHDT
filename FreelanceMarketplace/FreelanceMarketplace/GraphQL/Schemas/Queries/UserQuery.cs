using GraphQL.Types;
using GraphQL;
using FreelanceMarketplace.Services.Interface;
using FreelanceMarketplace.GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class UserQuery : ObjectGraphType
    {
        public UserQuery(IServiceProvider serviceProvider)
        {
            Field<ListGraphType<UserType>>("users")
                .Resolve(context =>
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                        return userService.GetUsers();
                    }
                });

            Field<UserType>("userByUsername")
                .Arguments(new QueryArguments(new QueryArgument<StringGraphType> { Name = "username" }))
                .ResolveAsync(async context =>
                {
                    string username = context.GetArgument<string>("username");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                        return await userService.GetUserByUsernameAsync(username);
                    }
                });

            Field<UserType>("userById")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }
                ))
                .Resolve(context =>
                {
                    int userId = context.GetArgument<int>("userId");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                        return userService.GetUserById(userId);
                    }
                });
        }
    }
}