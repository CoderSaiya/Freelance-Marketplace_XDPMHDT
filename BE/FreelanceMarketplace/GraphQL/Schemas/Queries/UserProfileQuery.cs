using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interfaces;
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
            // Single user profile - Public information, no authorization needed
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
            }.AuthorizeWith("Client", "Freelancer", "Admin"));

            AddField(new FieldType
            {
                Name = "profileByUserId",
                Type = typeof(UserProfileType),
                Arguments = new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await userProfileService.GetUserProfileByUserIdAsync(userId);
                })
            }.AuthorizeWith("Client", "Freelancer", "Admin"));

            AddField(new FieldType
            {
                Name = "allUserProfiles",
                Type = typeof(ListGraphType<UserProfileType>),
                Resolver = new FuncFieldResolver<object>(async context => await userProfileService.GetAllUserProfilesAsync())
            }.AuthorizeWith("Admin"));
        }
    }
}
