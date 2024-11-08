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
                    new QueryArgument<FloatGraphType> { Name = "rating" },
                    new QueryArgument<StringGraphType> { Name = "company" },
                    new QueryArgument<StringGraphType> { Name = "location" },
                    new QueryArgument<StringGraphType> { Name = "phone" },
                    new QueryArgument<DateTimeGraphType> { Name = "birthday" },
                    new QueryArgument<StringGraphType> { Name = "gender" },
                    new QueryArgument<StringGraphType> { Name = "bio" },
                    new QueryArgument<StringGraphType> { Name = "skill" },
                    new QueryArgument<StringGraphType> { Name = "avatar" },
                    new QueryArgument<StringGraphType> { Name = "industry" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var userProfile = await userProfileService.GetUserProfileByUserIdAsync(userId);
                    if (userProfile == null) return null;

                    userProfile.Rating = context.GetArgument<float?>("rating") ?? userProfile.Rating;
                    userProfile.Company = context.GetArgument<string>("company") ?? userProfile.Company;
                    userProfile.Location = context.GetArgument<string>("location") ?? userProfile.Location;
                    userProfile.Phone = context.GetArgument<string>("phone") ?? userProfile.Phone;
                    userProfile.Birthday = context.GetArgument<DateTime?>("birthday") ?? userProfile.Birthday;
                    userProfile.Gender = context.GetArgument<string>("gender") ?? userProfile.Gender;
                    userProfile.Bio = context.GetArgument<string>("bio") ?? userProfile.Bio;
                    userProfile.Skill = context.GetArgument<string>("skill") ?? userProfile.Skill;
                    userProfile.Avatar = context.GetArgument<string>("avatar") ?? userProfile.Avatar;
                    userProfile.Industry = context.GetArgument<string>("industry") ?? userProfile.Industry;

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
