using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class CategoryQuery : ObjectGraphType
    {
        public CategoryQuery(IServiceProvider serviceProvider)
        {
            Field<ListGraphType<CategoryType>>("categories")
                  .ResolveAsync(async context =>
                  {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var categoryService = scope.ServiceProvider.GetRequiredService<ICategoryService>();
                          return await categoryService.GetAllCategoriesAsync();
                      }
                });

            Field<CategoryType>("categoryById")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "categoryId" }
                ))
                .ResolveAsync(async context =>
                {
                    int categoryId = context.GetArgument<int>("categoryId");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var categoryService = scope.ServiceProvider.GetRequiredService<ICategoryService>();
                        return await categoryService.GetCategoryByIdAsync(categoryId);
                    }
                });
        }
    }
}
