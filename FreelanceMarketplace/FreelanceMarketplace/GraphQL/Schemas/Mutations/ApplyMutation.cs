using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class ApplyMutation : ObjectGraphType
    {
        public ApplyMutation(IApplyService applyService)
        {
            Field<ApplyType>("createApply")
                .Argument<NonNullGraphType<ApplyInputType>>("apply")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<Apply>("apply");
                    return await applyService.CreateApplyAsync(input);
                });

            Field<ApplyType>("updateApply")
                .Argument<NonNullGraphType<IntGraphType>>("applyId")
                .Argument<NonNullGraphType<ApplyInputType>>("apply")
                .ResolveAsync(async context =>
                {
                    var applyId = context.GetArgument<int>("applyId");
                    var input = context.GetArgument<Apply>("apply");
                    input.ApplyId = applyId; 
                    return await applyService.UpdateApplyAsync(input);
                });

            Field<BooleanGraphType>("deleteApply")
                .Argument<NonNullGraphType<IntGraphType>>("applyId")
                .ResolveAsync(async context =>
                {
                    var applyId = context.GetArgument<int>("applyId");
                    return await applyService.DeleteApplyAsync(applyId);
                });
        }
    }
}
