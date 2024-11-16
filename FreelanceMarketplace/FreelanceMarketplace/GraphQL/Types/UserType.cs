using FreelanceMarketplace.Models;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class UserType : ObjectGraphType<Users>
    {
        public UserType()
        {
            Field(x => x.Id);
            Field(x => x.Username);
            Field(x => x.PasswordHash);
            Field(x => x.Email);
            Field(x => x.Role);
            Field(x => x.IsEmailConfirmed);
            Field(x => x.Status);
            Field(x => x.CreateAt);
            Field<ListGraphType<ProjectType>>("projects");
            Field<ListGraphType<RefreshTokenType>>("refreshTokens");
            Field<ListGraphType<ProjectType>>("uploadedImages");
            Field<UserProfileType>("userProfile");
            Field<ReviewType>("review");
        }
    }
}
