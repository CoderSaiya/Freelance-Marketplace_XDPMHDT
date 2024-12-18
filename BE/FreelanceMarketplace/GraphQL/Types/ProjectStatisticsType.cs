using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ProjectStatisticsType : ObjectGraphType
    {
        public ProjectStatisticsType()
        {
            Name = "ProjectStatistics";

            Field<IntGraphType>("today");
            Field<IntGraphType>("thisWeek");
            Field<IntGraphType>("thisMonth");
            Field<IntGraphType>("thisYear");
        }
    }
}
