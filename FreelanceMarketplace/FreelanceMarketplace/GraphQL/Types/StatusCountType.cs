using FreelanceMarketplace.Models.DTOs;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class StatusCountType : ObjectGraphType<StatusCountDto>
    {
        public StatusCountType()
        {
            Field(x => x.Status).Description("The grouped status of the projects (e.g., Active + Processing, Finished).");
            Field(x => x.ProjectCount).Description("The number of projects in this status group.");
        }
    }
}
