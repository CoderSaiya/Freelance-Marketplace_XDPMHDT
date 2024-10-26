using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;
using GraphQL.Resolvers;
using FreelanceMarketplace.GraphQL.Authorization;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class ProjectMutation : ObjectGraphType
    {
        public ProjectMutation(IProjectService projectService)
        {
            AddField(new FieldType
            {
                Name = "createProject",
                Type = typeof(ProjectType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<ProjectInputType>> { Name = "project" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    Console.WriteLine("abc");
                    var projectInput = context.GetArgument<Dictionary<string, object>>("project");

                    var project = new Project
                    {
                        ProjectName = projectInput["projectName"]?.ToString(),
                        ProjectDescription = projectInput["projectDescription"]?.ToString(),
                        Budget = Convert.ToDouble(projectInput["budget"]),
                        Deadline = DateTime.Parse(projectInput["deadline"].ToString()),
                        Status = projectInput["status"]?.ToString(),
                        CategoryId = Convert.ToInt32(projectInput["categoryId"]),
                        SkillRequire = projectInput.ContainsKey("skillRequire") ? projectInput["skillRequire"].ToString() : null
                    };

                    var createdProject = await projectService.CreateProjectAsync(project);
                    return createdProject;
                })
            }.AuthorizeWith("Admin", "Client"));

            AddField(new FieldType
            {
                Name = "updateProject",
                Type = typeof(ProjectType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "projectId" },
                    new QueryArgument<NonNullGraphType<ProjectInputType>> { Name = "project" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var projectId = context.GetArgument<int>("projectId");
                    var input = context.GetArgument<Project>("project");
                    return await projectService.UpdateProjectAsync(projectId, input);
                })
            }.AuthorizeWith("Admin", "Client"));

            AddField(new FieldType
            {
                Name = "deleteProject",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "projectId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var projectId = context.GetArgument<int>("projectId");
                    return await projectService.DeleteProjectAsync(projectId);
                })
            }.AuthorizeWith("Admin", "Client"));

            AddField(new FieldType
            {
                Name = "checkProjectConflict",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" },
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "projectId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var projectId = context.GetArgument<int>("projectId");

                    return await projectService.CheckScheduleConflictAsync(userId, projectId);
                })
            }.AuthorizeWith("Admin", "Client"));

        }
    }
}
