using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class ProjectMutation : ObjectGraphType
    {
        public ProjectMutation(IProjectService projectService)
        {
            Field<ProjectType>("createProject")
                .Argument<NonNullGraphType<ProjectInputType>>("project")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<Project>("project");
                    return await projectService.CreateProjectAsync(input); 
                });

            Field<ProjectType>("updateProject")
                .Argument<NonNullGraphType<IntGraphType>>("projectId")
                .Argument<NonNullGraphType<ProjectInputType>>("project")
                .ResolveAsync(async context =>
                {
                    var projectId = context.GetArgument<int>("projectId");
                    var input = context.GetArgument<Project>("project");
                    return await projectService.UpdateProjectAsync(projectId, input); 
                });

            Field<BooleanGraphType>("deleteProject")
                .Argument<NonNullGraphType<IntGraphType>>("projectId")
                .ResolveAsync(async context =>
                {
                    var projectId = context.GetArgument<int>("projectId");
                    return await projectService.DeleteProjectAsync(projectId); 
                });
        }
    }
}
