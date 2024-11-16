using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ContractStatisticsType : ObjectGraphType
    {
        public ContractStatisticsType()
        {
            Name = "ContractStatistics";

            Field<IntGraphType>("today");
            Field<IntGraphType>("thisWeek");
            Field<IntGraphType>("thisMonth");
            Field<IntGraphType>("thisYear");
        }
    }
}
