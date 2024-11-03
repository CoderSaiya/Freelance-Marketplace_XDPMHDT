using FreelanceMarketplace.Models;
using GraphQL.Types;
using System.Management;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ProjectType : ObjectGraphType<Project>
    {
        public ProjectType()
        {
            Field(x => x.ProjectId);
            Field(x => x.ProjectName);
            Field(x => x.ProjectDescription);
            Field(x => x.Budget);
            Field(x => x.Deadline);
            Field(x => x.SkillRequire);
            Field(x => x.Status);
            Field(x => x.CreateAt);

            Field<CategoryType>("category");
            Field<UserType>("user").Resolve(context => context.Source.Users);
            Field<ListGraphType<ApplyType>>("applies");
            Field<ListGraphType<StringGraphType>>("imageUrls")
            .Resolve(context => context.Source.Images.Select(i => i.ImageUrl));
        }
    }
}
