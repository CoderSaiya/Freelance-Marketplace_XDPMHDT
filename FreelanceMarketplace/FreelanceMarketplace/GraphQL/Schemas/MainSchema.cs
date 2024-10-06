using FreelanceMarketplace.GraphQL.Schemas.Queries;
using FreelanceMarketplace.GraphQL.Schemas.Mutations;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas
{
    public class MainSchema : Schema
    {
        public MainSchema(IServiceProvider serviceProvider) : base(serviceProvider)
        {
            Query = serviceProvider.GetRequiredService<UserQuery>();
            //Mutation = serviceProvider.GetRequiredService<UserMutation>();
        }
    }
}