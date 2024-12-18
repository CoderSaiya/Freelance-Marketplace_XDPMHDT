using FreelanceMarketplace.Models;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class UserProfileType : ObjectGraphType<UserProfile>
    {
        public UserProfileType()
        {
            Field(x => x.Id);
            Field(x => x.Rating);
            Field(x => x.Company);
            Field(x => x.Phone);
            Field(x => x.Birthday);
            Field(x => x.Gender);
            Field(x => x.Location);
            Field(x => x.Bio);
            Field(x => x.Skill);
            Field(x => x.Avatar);
            Field(x => x.Industry);
            Field(x => x.Status);
        }
    }
}
