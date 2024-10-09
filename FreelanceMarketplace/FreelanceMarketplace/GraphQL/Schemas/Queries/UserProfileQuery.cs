using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class UserProfileQuery : ObjectGraphType
    {
        public UserProfileQuery(IUserProfileService userProfileService)
        {
            Field<UserProfileType>("userProfile")
                .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }))
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await userProfileService.GetUserProfileByIdAsync(id);
                });

            Field<ListGraphType<UserProfileType>>("allUserProfiles")
                .ResolveAsync(async context => await userProfileService.GetAllUserProfilesAsync());
        }
    }
}
