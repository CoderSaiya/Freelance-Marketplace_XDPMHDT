using GraphQL.Types;
using GraphQL;
using FreelanceMarketplace.Services.Interface;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;
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

            Field<UserType>("user")
                .Arguments(new QueryArguments(new QueryArgument<StringGraphType> { Name = "username" }))
                .ResolveAsync(async context =>
                {
                    string username = context.GetArgument<string>("username");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                        // Assuming GetUserByUsername is async. If it's not, remove the await and async keywords.
                        return await userService.GetUserByUsernameAsync(username);
                    }
                });
        }
    }
}