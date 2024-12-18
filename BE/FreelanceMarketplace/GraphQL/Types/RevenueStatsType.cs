using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class RevenueStatisticsType : ObjectGraphType
    {
        public RevenueStatisticsType()
        {
            Name = "RevenueStatistics";

            Field<DecimalGraphType>("today");
            Field<DecimalGraphType>("thisWeek");
            Field<DecimalGraphType>("thisMonth");
            Field<DecimalGraphType>("thisYear");
        }
    }
}
