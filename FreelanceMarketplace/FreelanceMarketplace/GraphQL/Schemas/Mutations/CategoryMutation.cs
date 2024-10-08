using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class CategoryMutation : ObjectGraphType
    {
        public CategoryMutation(ICategoryService categoryService)
        {
            Field<CategoryType>("createCategory")
                .Argument<NonNullGraphType<CategoryInputType>>("category")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<Category>("category");
                    return await categoryService.CreateCategoryAsync(input);
                });

            Field<CategoryType>("updateCategory")
                .Argument<NonNullGraphType<IntGraphType>>("categoryId")
                .Argument<NonNullGraphType<CategoryInputType>>("category")
                .ResolveAsync(async context =>
                {
                    var categoryId = context.GetArgument<int>("categoryId");
                    var input = context.GetArgument<Category>("category");
                    return await categoryService.UpdateCategoryAsync(categoryId, input);
                });

            Field<BooleanGraphType>("deleteCategory")
                .Argument<NonNullGraphType<IntGraphType>>("categoryId")
                .ResolveAsync(async context =>
                {
                    var categoryId = context.GetArgument<int>("categoryId");
                    return await categoryService.DeleteCategoryAsync(categoryId);
                });
        }
    }
}
