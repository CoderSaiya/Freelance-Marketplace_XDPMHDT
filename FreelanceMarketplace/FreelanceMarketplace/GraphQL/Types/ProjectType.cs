using FreelanceMarketplace.Models;
using GraphQL.Types;

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
            Field<ListGraphType<ApplyType>>("applies");
            //Field<ListGraphType<ImgType>>("images");
        }
    }
}
