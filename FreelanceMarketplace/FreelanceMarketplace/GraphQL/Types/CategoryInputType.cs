using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class CategoryInputType : InputObjectGraphType
    {
        public CategoryInputType()
        {
            Name = "CategoryInput";

            Field<NonNullGraphType<StringGraphType>>("categoryName"); 
            Field<StringGraphType>("categoryDescription"); 
        }
    }
}
