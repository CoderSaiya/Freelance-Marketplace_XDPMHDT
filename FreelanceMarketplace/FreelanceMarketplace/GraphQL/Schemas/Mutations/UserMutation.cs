using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL.Types;
using GraphQL;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs.Req;
using FreelanceMarketplace.Data;
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

            AddField(new FieldType
            {
                Name = "forgotPassword",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "email" }
            ),
                Resolver = new FuncFieldResolver<bool>(async context =>
                {
                    var userService = serviceProvider.GetRequiredService<IUserService>();
                    string email = context.GetArgument<string>("email");
                    return await userService.ForgotPassword(email);
                })
            });

            AddField(new FieldType
            {
                Name = "verifyCode",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "email" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "code" }
            ),
                Resolver = new FuncFieldResolver<bool>(async context =>
                {
                    var userService = serviceProvider.GetRequiredService<IUserService>();
                    string email = context.GetArgument<string>("email");
                    string code = context.GetArgument<string>("code");
                    return await userService.VerifyCode(email, code);
                })
            });

            AddField(new FieldType
            {
                Name = "changePassword",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "email" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "newPass" }
            ),
                Resolver = new FuncFieldResolver<bool>(async context =>
                {
                    var userService = serviceProvider.GetRequiredService<IUserService>();
                    string email = context.GetArgument<string>("email");
                    string newPass = context.GetArgument<string>("newPass");
                    return await userService.ChangePass(email, newPass);
                })
            });
        }
    }
}
