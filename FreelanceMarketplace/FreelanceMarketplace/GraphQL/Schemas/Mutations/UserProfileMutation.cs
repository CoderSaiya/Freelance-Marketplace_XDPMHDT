using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
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
            // Create user profile - Any authenticated user can create their own profile
            AddField(new FieldType
            {
                Name = "createUserProfile",
                Type = typeof(UserProfileType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<FloatGraphType>> { Name = "rating" },
                    new QueryArgument<StringGraphType> { Name = "company" },
                    new QueryArgument<StringGraphType> { Name = "location" },
                    new QueryArgument<StringGraphType> { Name = "bio" },
                    new QueryArgument<StringGraphType> { Name = "skill" },
                    new QueryArgument<StringGraphType> { Name = "avatar" },
                    new QueryArgument<StringGraphType> { Name = "industry" },
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var userProfile = new UserProfile
                    {
                        Rating = context.GetArgument<float>("rating"),
                        Company = context.GetArgument<string>("company"),
                        Location = context.GetArgument<string>("location"),
                        Bio = context.GetArgument<string>("bio"),
                        Skill = context.GetArgument<string>("skill"),
                        Avatar = context.GetArgument<string>("avatar"),
                        Industry = context.GetArgument<string>("industry"),
                        UserId = context.GetArgument<int>("userId")
                    };
                    return await userProfileService.CreateUserProfileAsync(userProfile);
                })
            }.AuthorizeWith("Admin", "Freelancer", "Client"));

            // Update user profile - Profile owner or Admin can update
            AddField(new FieldType
            {
                Name = "updateUserProfile",
                Type = typeof(UserProfileType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" },
                    new QueryArgument<FloatGraphType> { Name = "rating" },
                    new QueryArgument<StringGraphType> { Name = "company" },
                    new QueryArgument<StringGraphType> { Name = "location" },
                    new QueryArgument<StringGraphType> { Name = "bio" },
                    new QueryArgument<StringGraphType> { Name = "skill" },
                    new QueryArgument<StringGraphType> { Name = "avatar" },
                    new QueryArgument<StringGraphType> { Name = "industry" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var userProfile = await userProfileService.GetUserProfileByIdAsync(id);
                    if (userProfile == null) return null;

                    userProfile.Rating = context.GetArgument<float?>("rating") ?? userProfile.Rating;
                    userProfile.Company = context.GetArgument<string>("company") ?? userProfile.Company;
                    userProfile.Location = context.GetArgument<string>("location") ?? userProfile.Location;
                    userProfile.Bio = context.GetArgument<string>("bio") ?? userProfile.Bio;
                    userProfile.Skill = context.GetArgument<string>("skill") ?? userProfile.Skill;
                    userProfile.Avatar = context.GetArgument<string>("avatar") ?? userProfile.Avatar;
                    userProfile.Industry = context.GetArgument<string>("industry") ?? userProfile.Industry;

                    return await userProfileService.UpdateUserProfileAsync(userProfile);
                })
            }.AuthorizeWith("Admin", "Freelancer", "Client")); // Allow all authenticated users since ownership check should be done in service

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
