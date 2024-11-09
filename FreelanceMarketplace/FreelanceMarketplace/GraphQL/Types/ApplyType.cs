using FreelanceMarketplace.Models;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ApplyType : ObjectGraphType<Apply>
    {
        public ApplyType()
        {
            Field(x => x.ApplyId);
            Field(x => x.FreelancerId);
            Field(x => x.ClientId);
            Field(x => x.ProjectId);
            Field(x => x.Duration);
            Field(x => x.Status);
            Field(x => x.CreateAt);

            Field<UserType>("freelancer");
            Field<UserType>("client");
            Field<ProjectType>("project");
        }
    }
}
