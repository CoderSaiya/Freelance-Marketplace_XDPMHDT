using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ProjectInputType : InputObjectGraphType
    {
        public ProjectInputType()
        {
            Name = "ProjectInput";

            Field<NonNullGraphType<StringGraphType>>("projectName");
            Field<StringGraphType>("projectDescription");
            Field<NonNullGraphType<DecimalGraphType>>("budget");
            Field<NonNullGraphType<DateGraphType>>("deadline");
            Field<NonNullGraphType<StringGraphType>>("skillRequired");
            Field<NonNullGraphType<StringGraphType>>("status");
            Field<NonNullGraphType<IntGraphType>>("categoryId");
        }
    }
}
