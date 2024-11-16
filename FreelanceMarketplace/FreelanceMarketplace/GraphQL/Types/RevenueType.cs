using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class RevenueType : ObjectGraphType
    {
        public RevenueType()
        {
            Field<StringGraphType>("month").Description("The month name");
            Field<FloatGraphType>("revenue").Description("Total revenue for the month");
        }
    }
}
