using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Types;
using GraphQL.Resolvers;
using FreelanceMarketplace.GraphQL.Authorization;


namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class CategoryMutation : ObjectGraphType
    {
        public CategoryMutation(ICategoryService categoryService)
        {
            // Mutation để tạo category
            AddField(new FieldType
            {
                Name = "createCategory",
                Type = typeof(CategoryType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<CategoryInputType>> { Name = "category" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var input = context.GetArgument<Category>("category");
                    return await categoryService.CreateCategoryAsync(input);
                })
            }.AuthorizeWith("Admin"));  

            AddField(new FieldType
            {
                Name = "updateCategory",
                Type = typeof(CategoryType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "categoryId" },
                    new QueryArgument<NonNullGraphType<CategoryInputType>> { Name = "category" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var categoryId = context.GetArgument<int>("categoryId");
                    var input = context.GetArgument<Category>("category");
                    return await categoryService.UpdateCategoryAsync(categoryId, input);
                })
            }.AuthorizeWith("Admin"));  

            AddField(new FieldType
            {
                Name = "deleteCategory",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "categoryId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var categoryId = context.GetArgument<int>("categoryId");
                    return await categoryService.DeleteCategoryAsync(categoryId);
                })
            }.AuthorizeWith("Admin"));  
        }
    }
}
