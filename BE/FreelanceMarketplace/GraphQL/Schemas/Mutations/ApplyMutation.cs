using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Types;
using GraphQL.Resolvers;
using FreelanceMarketplace.GraphQL.Authorization;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class ApplyMutation : ObjectGraphType
    {
        public ApplyMutation(IApplyService applyService)
        {
            AddField(new FieldType
            {
                Name = "createApply",
                Type = typeof(ApplyType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<ApplyInputType>> { Name = "apply" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var input = context.GetArgument<Apply>("apply");
                    return await applyService.CreateApplyAsync(input);
                })
            }.AuthorizeWith("Freelancer"));

            AddField(new FieldType
            {
                Name = "updateApply",
                Type = typeof(ApplyType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "applyId" },
                    new QueryArgument<NonNullGraphType<ApplyInputType>> { Name = "apply" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var applyId = context.GetArgument<int>("applyId");
                    var input = context.GetArgument<Apply>("apply");
                    input.ApplyId = applyId;
                    return await applyService.UpdateApplyAsync(input);
                })
            }.AuthorizeWith("Freelancer"));

            AddField(new FieldType
            {
                Name = "deleteApply",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "applyId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var applyId = context.GetArgument<int>("applyId");
                    return await applyService.DeleteApplyAsync(applyId);
                })
            }.AuthorizeWith("Admin"));

            AddField(new FieldType
            {
                Name = "acceptApply",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "applyId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var applyId = context.GetArgument<int>("applyId");
                    return await applyService.AcceptApply(applyId);
                })
            }.AuthorizeWith("Client"));
        }
    }
}
