using FreelanceMarketplace.Models.DTOs;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class CategoryPercentageType : ObjectGraphType<CategoryPercentageDto>
    {
        public CategoryPercentageType()
        {
            Field(x => x.CategoryName).Description("The name of the category.");
            Field(x => x.ProjectCount).Description("The number of projects in this category.");
            Field(x => x.Percentage).Description("The percentage of projects in this category.");
        }
    }

}
