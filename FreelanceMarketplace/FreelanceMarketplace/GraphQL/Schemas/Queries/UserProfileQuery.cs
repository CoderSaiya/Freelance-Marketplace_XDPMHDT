using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using FreelanceMarketplace.GraphQL.Authorization;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class UserProfileQuery : ObjectGraphType
    {
        public UserProfileQuery(IUserProfileService userProfileService)
        {
            /*
            Field<UserProfileType>("userProfile")
                .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }))
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await userProfileService.GetUserProfileByIdAsync(id);
                });

            Field<ListGraphType<UserProfileType>>("allUserProfiles")
                .ResolveAsync(async context => await userProfileService.GetAllUserProfilesAsync());
            */
            AddField(new FieldType
            {
                Name = "userProfile",
                Type = typeof(UserProfileType),
                Arguments = new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await userProfileService.GetUserProfileByIdAsync(id);
                })
            }.AuthorizeWith("User"));

            AddField(new FieldType
            {
                Name = "allUserProfiles",
                Type = typeof(ListGraphType<UserProfileType>),
                Resolver = new FuncFieldResolver<object>(async context => await userProfileService.GetAllUserProfilesAsync())
            }.AuthorizeWith("Admin"));
        }
    }
}
