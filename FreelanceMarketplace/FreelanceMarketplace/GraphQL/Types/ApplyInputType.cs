using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ApplyInputType : InputObjectGraphType
    {
        public ApplyInputType()
        {
            Name = "ApplyInput";

            Field<NonNullGraphType<IntGraphType>>("freelancerId");
            Field<NonNullGraphType<IntGraphType>>("clientId");
            Field<NonNullGraphType<IntGraphType>>("projectId");
            Field<IntGraphType>("duration");
            Field<StringGraphType>("status");
        }
    }
}
