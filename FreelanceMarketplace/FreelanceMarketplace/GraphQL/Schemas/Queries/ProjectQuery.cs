using FreelanceMarketplace.GraphQL.Authorization;
using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class ProjectQuery : ObjectGraphType
    {
        public ProjectQuery(IServiceProvider serviceProvider)
        {
            AddField(new FieldType
            {
                Name = "projects",
                Type = typeof(ListGraphType<ProjectType>),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var projectService = scope.ServiceProvider.GetRequiredService<IProjectService>();
                        return await projectService.GetAllProjectsAsync();
                    }
                })
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

            AddField(new FieldType
            {
                Name = "projectByClient",
                Type = typeof(ListGraphType<ProjectType>),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "clientId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    int clientId = context.GetArgument<int>("clientId");
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var projectService = scope.ServiceProvider.GetRequiredService<IProjectService>();
                        return await projectService.GetProjectByClientAsync(clientId);
                    }
                })
            }).AuthorizeWith("Client", "Admin");

            Field<ListGraphType<ProjectType>>("popularProjects")
                .ResolveAsync(async context =>
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var projectService = scope.ServiceProvider.GetRequiredService<IProjectService>();
                        return await projectService.GetPopularProjectsAsync();
                    }
                });
        }
    }
}
