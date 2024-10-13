using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class ProjectQuery : ObjectGraphType
    {
        public ProjectQuery(IServiceProvider serviceProvider)
        {
            Field<ListGraphType<ProjectType>>("projects")
                .ResolveAsync(async context =>
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var projectService = scope.ServiceProvider.GetRequiredService<IProjectService>();
                        return await projectService.GetAllProjectsAsync();
                    }
                });

            Field<ProjectType>("projectById")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "projectId" }
                ))
                .ResolveAsync(async context =>
                {
                    int projectId = context.GetArgument<int>("projectId");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var projectService = scope.ServiceProvider.GetRequiredService<IProjectService>();
                        return await projectService.GetProjectByIdAsync(projectId);
                    }
                });
        }
    }
}
