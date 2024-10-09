using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class ApplyQuery : ObjectGraphType
    {
        public ApplyQuery(IServiceProvider serviceProvider)
        {
            Field<ListGraphType<ApplyType>>("applies")
                .ResolveAsync(async context =>
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var applyService = scope.ServiceProvider.GetRequiredService<IApplyService>();
                        return await applyService.GetAppliesForProjectAsync(context.GetArgument<int>("projectId"));
                    }
                });

            Field<ApplyType>("applyById")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "applyId" }
                ))
                .ResolveAsync(async context =>
                {
                    int applyId = context.GetArgument<int>("applyId");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var applyService = scope.ServiceProvider.GetRequiredService<IApplyService>();
                        return await applyService.GetApplyByIdAsync(applyId);
                    }
                });
        }
    }
}
