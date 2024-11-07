using GraphQL.Types;
using GraphQL;
using FreelanceMarketplace.Services.Interfaces;
using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.GraphQL.Authorization;
using GraphQL.Resolvers;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class UserQuery : ObjectGraphType
    {
        public UserQuery(IServiceProvider serviceProvider)
        {
            AddField(new FieldType
            {
                Name = "users",
                Type = typeof(ListGraphType<UserType>),
                Resolver = new FuncFieldResolver<object>(context =>
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                        return userService.GetUsers().ToList();
                    }
                })
            }.AuthorizeWith("Admin"));

            AddField(new FieldType
            {
                Name = "userByUsername",
                Type = typeof(UserType),
                Arguments = new QueryArguments(new QueryArgument<StringGraphType> { Name = "username" }),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    string username = context.GetArgument<string>("username");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                        return await userService.GetUserByUsernameAsync(username);
                    }
                })
            }.AuthorizeWith("Admin"));

            AddField(new FieldType
            {
                Name = "userById",
                Type = typeof(UserType),
                Arguments = new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }),
                Resolver = new FuncFieldResolver<object>(context =>
                {
                    int userId = context.GetArgument<int>("userId");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                        return userService.GetUserById(userId);
                    }
                })
            }.AuthorizeWith("Admin"));
        }
    }
}