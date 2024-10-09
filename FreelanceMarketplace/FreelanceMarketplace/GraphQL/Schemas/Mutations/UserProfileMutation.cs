using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class UserProfileMutation : ObjectGraphType
    {
        public UserProfileMutation(IUserProfileService userProfileService)
        {
            Field<UserProfileType>("createUserProfile")
                .Arguments(
                    new QueryArguments(
                        new QueryArgument<NonNullGraphType<FloatGraphType>> { Name = "rating" },
                        new QueryArgument<StringGraphType> { Name = "company" },
                        new QueryArgument<StringGraphType> { Name = "location" },
                        new QueryArgument<StringGraphType> { Name = "bio" },
                        new QueryArgument<StringGraphType> { Name = "skill" },
                        new QueryArgument<StringGraphType> { Name = "avatar" },
                        new QueryArgument<StringGraphType> { Name = "industry" },
                        new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }
                    )
                )
                .ResolveAsync(async context =>
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
                });

            Field<UserProfileType>("updateUserProfile")
                .Arguments(
                    new QueryArguments(
                        new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" },
                        new QueryArgument<FloatGraphType> { Name = "rating" },
                        new QueryArgument<StringGraphType> { Name = "company" },
                        new QueryArgument<StringGraphType> { Name = "location" },
                        new QueryArgument<StringGraphType> { Name = "bio" },
                        new QueryArgument<StringGraphType> { Name = "skill" },
                        new QueryArgument<StringGraphType> { Name = "avatar" },
                        new QueryArgument<StringGraphType> { Name = "industry" }
                    )
                )
                .ResolveAsync(async context =>
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
                });

            Field<BooleanGraphType>("deleteUserProfile")
                .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }))
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await userProfileService.DeleteUserProfileAsync(id);
                });
        }
    }
}
