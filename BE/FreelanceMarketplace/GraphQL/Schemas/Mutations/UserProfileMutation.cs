using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using FreelanceMarketplace.GraphQL.Authorization;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class UserProfileMutation : ObjectGraphType
    {
        public UserProfileMutation(IUserProfileService userProfileService)
        {
            // Update user profile - Profile owner or Admin can update
            AddField(new FieldType
            {
                Name = "updateUserProfile",
                Type = typeof(UserProfileType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" },
                    new QueryArgument<NonNullGraphType<UserProfileInputType>> { Name = "userProfileInput" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    Console.WriteLine("hehe");
                    var userId = context.GetArgument<int>("userId");
                    var input = context.GetArgument<UserProfile>("userProfileInput");

                    var userProfile = await userProfileService.GetUserProfileByUserIdAsync(userId);
                    if (userProfile == null) return null;

                    userProfile.Rating = input.Rating;
                    userProfile.Company = input.Company ?? userProfile.Company;
                    userProfile.Location = input.Location ?? userProfile.Location;
                    userProfile.Phone = input.Phone ?? userProfile.Phone;
                    userProfile.Birthday = input.Birthday ?? userProfile.Birthday;
                    userProfile.Gender = input.Gender ?? userProfile.Gender;
                    userProfile.Bio = input.Bio ?? userProfile.Bio;
                    userProfile.Skill = input.Skill ?? userProfile.Skill;
                    userProfile.Avatar = input.Avatar ?? userProfile.Avatar;
                    userProfile.Industry = input.Industry ?? userProfile.Industry;

                    return await userProfileService.UpdateUserProfileAsync(userProfile);
                })
            }.AuthorizeWith("Freelancer", "Client", "Admin"));

            // Delete user profile - Only Admin can delete profiles
            AddField(new FieldType
            {
                Name = "deleteUserProfile",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await userProfileService.DeleteUserProfileAsync(id);
                })
            }.AuthorizeWith("Admin"));
        }
    }
}
