using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class UserProfileInputType : InputObjectGraphType
    {
        public UserProfileInputType()
        {
            Name = "UserProfileInput";

            Field<FloatGraphType>("rating");
            Field<StringGraphType>("company");
            Field<StringGraphType>("location");
            Field<StringGraphType>("phone");
            Field<DateTimeGraphType>("birthday");
            Field<StringGraphType>("gender");
            Field<StringGraphType>("bio");
            Field<StringGraphType>("skill");
            Field<StringGraphType>("avatar");
            Field<StringGraphType>("industry");
        }
    }
}
