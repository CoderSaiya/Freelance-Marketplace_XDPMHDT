using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using FreelanceMarketplace.GraphQL.Authorization;
using FreelanceMarketplace.Services;
using FreelanceMarketplace.Models;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class ApplyQuery : ObjectGraphType
    {
        public ApplyQuery(IServiceProvider serviceProvider)
        {
            AddField(new FieldType
            {
                Name = "appliesByProjectId",
                Type = typeof(ListGraphType<ApplyType>),
                Arguments = new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "projectId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var applyService = scope.ServiceProvider.GetRequiredService<IApplyService>();
                        return await applyService.GetAppliesForProjectAsync(context.GetArgument<int>("projectId"));
                    }
                })
            }.AuthorizeWith("Freelancer", "Client"));

            AddField(new FieldType
            {
                Name = "applies",
                Type = typeof(ListGraphType<ApplyType>),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var applyService = scope.ServiceProvider.GetRequiredService<IApplyService>();
                        return await applyService.GetApplyAsync();
                    }
                })
            }.AuthorizeWith("Freelancer", "Client"));

            AddField(new FieldType
            {
                Name = "applyByFreelancerId",
                Type = typeof(ListGraphType<ApplyType>),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "freelancerId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    int freelancerId = context.GetArgument<int>("freelancerId");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var applyService = scope.ServiceProvider.GetRequiredService<IApplyService>();
                        return await applyService.GetApplyByFreelancerIdAsync(freelancerId);
                    }
                })
            }.AuthorizeWith("Freelancer", "Admin", "Client"));

            AddField(new FieldType
            {
                Name = "applyById",
                Type = typeof(ApplyType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "applyId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    int applyId = context.GetArgument<int>("applyId");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var applyService = scope.ServiceProvider.GetRequiredService<IApplyService>();
                        return await applyService.GetApplyByIdAsync(applyId);
                    }
                })
            }.AuthorizeWith("Freelancer", "Client"));

            AddField(new FieldType
            {
                Name = "hasAppliedForProject",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "projectId" },
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "freelancerId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var projectId = context.GetArgument<int>("projectId");
                    var freelancerId = context.GetArgument<int>("freelancerId");

                    using (var scope = serviceProvider.CreateScope())
                    {
                        var applyService = scope.ServiceProvider.GetRequiredService<IApplyService>();
                        var applied = await applyService.HasFreelancerAppliedForProjectAsync(freelancerId, projectId);
                        return applied;
                    }
                })
            }.AuthorizeWith("Freelancer"));
        }
    }
}
