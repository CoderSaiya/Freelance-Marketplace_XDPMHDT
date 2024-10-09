using FreelanceMarketplace.GraphQL.Schemas.Queries;
using FreelanceMarketplace.GraphQL.Schemas.Mutations;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace FreelanceMarketplace.GraphQL.Schemas
{
    public class MainSchema : Schema
    {
        public MainSchema(IServiceProvider serviceProvider) : base(serviceProvider)
        {
            Query = new CombinedQuery(
            serviceProvider.GetRequiredService<UserQuery>(),
            serviceProvider.GetRequiredService<ContractQuery>(),
            serviceProvider.GetRequiredService<CategoryQuery>(),
             serviceProvider.GetRequiredService<ProjectQuery>(),
              serviceProvider.GetRequiredService<ReviewQuery>(),
            serviceProvider.GetRequiredService<PaymentQuery>()
            );

            Mutation = new CombinedMutation(
            serviceProvider.GetRequiredService<UserMutation>(),
            serviceProvider.GetRequiredService<ContractMutation>(),
            serviceProvider.GetRequiredService<CategoryMutation>(),
             serviceProvider.GetRequiredService<ProjectMutation>(),
             serviceProvider.GetRequiredService<ReviewMutation>(),
            serviceProvider.GetRequiredService<PaymentMutation>()
            );
        }

        public class CombinedQuery : ObjectGraphType
        {
            public CombinedQuery(UserQuery userQuery, ContractQuery contractQuery, CategoryQuery categoryQuery, ProjectQuery projectQuery, ReviewQuery reviewQuery, PaymentQuery paymentQuery)
            {
                foreach (var field in userQuery.Fields)
                {
                    AddField(field);
                }

                foreach (var field in contractQuery.Fields)
                {
                    AddField(field);
                }

                foreach (var field in categoryQuery.Fields)
                {
                    AddField(field);
                }

                foreach (var field in projectQuery.Fields)
                {
                    AddField(field);
                }

                foreach (var field in reviewQuery.Fields)
                {
                    AddField(field);
                }

                foreach (var field in paymentQuery.Fields)
                {
                    AddField(field);
                }
            }
        }

        public class CombinedMutation : ObjectGraphType
        {
            public CombinedMutation(UserMutation userMutation, ContractMutation contractMutation, CategoryMutation categoryMutation, ProjectMutation projectMutation, ReviewMutation reviewMutation, PaymentMutation paymentMutation)
            {
                foreach (var field in userMutation.Fields)
                {
                    AddField(field);
                }

                foreach (var field in contractMutation.Fields)
                {
                    AddField(field);
                }

                foreach (var field in categoryMutation.Fields)
                {
                    AddField(field);
                }

                foreach (var field in projectMutation.Fields)
                {
                    AddField(field);
                }

                foreach (var field in reviewMutation.Fields)
                {
                    AddField(field);
                }

                foreach (var field in paymentMutation.Fields)
                {
                    AddField(field);
                }
            }
        }
    }
}