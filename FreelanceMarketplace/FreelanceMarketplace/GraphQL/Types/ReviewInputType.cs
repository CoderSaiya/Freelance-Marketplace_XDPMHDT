using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ReviewInputType : InputObjectGraphType
    {
        public ReviewInputType()
        {
            Name = "ReviewInput";

            Field<NonNullGraphType<IntGraphType>>("userId");
            Field<NonNullGraphType<IntGraphType>>("contractId");
            Field<NonNullGraphType<IntGraphType>>("rating");
            Field<StringGraphType>("feedback");
        }
    }
}
