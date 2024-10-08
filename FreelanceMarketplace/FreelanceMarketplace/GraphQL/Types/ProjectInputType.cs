using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ProjectInputType : InputObjectGraphType
    {
        public ProjectInputType()
        {
            Name = "ProjectInput";

            Field<NonNullGraphType<StringGraphType>>("projectName");
            Field<NonNullGraphType<StringGraphType>>("projectDescription");
            Field<NonNullGraphType<FloatGraphType>>("budget");
            Field<NonNullGraphType<DateTimeGraphType>>("deadline");
            Field<StringGraphType>("skillRequire");
            Field<NonNullGraphType<StringGraphType>>("status");
        }
    }
}
