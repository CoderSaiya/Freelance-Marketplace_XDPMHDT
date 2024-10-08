using FreelanceMarketplace.Models;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class CategoryType : ObjectGraphType<Category>
    {
        public CategoryType()
        {
            Field(x => x.CategoryId);
            Field(x => x.CategoryName);
            Field(x => x.CategoryDescription);
            Field<ListGraphType<ProjectType>>("projects");
        }
    }
}
