using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Types;
using GraphQL.Resolvers;
using FreelanceMarketplace.GraphQL.Authorization;
using System.Security.Claims;
using System.ComponentModel;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class ProjectMutation : ObjectGraphType
    {
        public ProjectMutation(IProjectService projectService)
        {
            //AddField(new FieldType
            //{
            //    Name = "createProject",
            //    Type = typeof(ProjectType),
            //    Arguments = new QueryArguments(
            //    new QueryArgument<NonNullGraphType<ProjectInputType>> { Name = "project" }
            //),
            //    Resolver = new FuncFieldResolver<object>(async context =>
            //    {
            //        var httpContext = context.UserContext as HttpContext;
            //        var user = httpContext.User;
            //        var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            //        if (string.IsNullOrEmpty(userIdClaim))
            //        {
            //            throw new ExecutionError("User ID not found in token");
            //        }

            //        if (!int.TryParse(userIdClaim, out var userId))
            //        {
            //            throw new ExecutionError("Invalid User ID format");
            //        }

            //        var projectInput = context.GetArgument<Project>("project");

            //        var file = httpContext.Request.Form.Files.FirstOrDefault();

            //        if (file == null)
            //        {
            //            throw new ExecutionError("File not found in request");
            //        }

            //        return await projectService.CreateProjectAsync(projectInput, file, userId);
            //    })
            //}.AuthorizeWith("Admin", "Client"));

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
                        UserId = Convert.ToInt32(projectInput["userId"]),
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
