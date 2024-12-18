using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class FreelancerStatisticsType : ObjectGraphType
    {
        public FreelancerStatisticsType()
        {
            Name = "FreelancerStatistics";

            Field<IntGraphType>("today");
            Field<IntGraphType>("thisWeek");
            Field<IntGraphType>("thisMonth");
            Field<IntGraphType>("thisYear");
        }
    }
}