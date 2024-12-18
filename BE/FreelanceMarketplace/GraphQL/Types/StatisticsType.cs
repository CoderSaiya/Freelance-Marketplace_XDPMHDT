using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class StatisticsType : ObjectGraphType
    {
        public StatisticsType()
        {
            Name = "Statistics";

            Field<RevenueStatisticsType>("revenueStatistics").Description("Revenue statistics based on today, week, month, and year");
            Field<ProjectStatisticsType>("projectStatistics").Description("Project statistics based on today, week, month, and year");
            Field<FreelancerStatisticsType>("freelancerStatistics").Description("Freelancer statistics based on today, week, month, and year");
            Field<ContractStatisticsType>("contractStatistics").Description("Contract statistics based on today, week, month, and year");
        }
    }
}
