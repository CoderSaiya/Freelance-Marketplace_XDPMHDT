using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL.Types;
using GraphQL;
using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class UserMutation : ObjectGraphType
    {
        //public UserMutation(IUserService userService)
        //{
        //    Field<UserType>(
        //        "addUser",
        //        arguments: new QueryArguments(
        //            new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "username" },
        //            new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "email" },
        //            new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "passwordHash" }
        //        ),
        //        resolve: context =>
        //        {
        //            var username = context.GetArgument<string>("username");
        //            var email = context.GetArgument<string>("email");
        //            var passwordHash = context.GetArgument<string>("passwordHash");

        //            var user = new Users { Username = username, Email = email, PasswordHash = passwordHash };
        //            return userService.RegisterUserAsync(user);
        //        }
        //    );
        //}
    }
}
