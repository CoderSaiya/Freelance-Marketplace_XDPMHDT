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
             serviceProvider.GetRequiredService<UserProfileQuery>(),
            serviceProvider.GetRequiredService<NotificationQuery>(),
            serviceProvider.GetRequiredService<ContractQuery>(),
            serviceProvider.GetRequiredService<CategoryQuery>(),
             serviceProvider.GetRequiredService<ProjectQuery>(),
              serviceProvider.GetRequiredService<ReviewQuery>(),
            serviceProvider.GetRequiredService<PaymentQuery>(),
             serviceProvider.GetRequiredService<ApplyQuery>(),
             serviceProvider.GetRequiredService<WalletQuery>()

            );

            Mutation = new CombinedMutation(
            serviceProvider.GetRequiredService<UserMutation>(),
             serviceProvider.GetRequiredService<UserProfileMutation>(),
            serviceProvider.GetRequiredService<NotificationMutation>(),
            serviceProvider.GetRequiredService<ContractMutation>(),
            serviceProvider.GetRequiredService<CategoryMutation>(),
             serviceProvider.GetRequiredService<ProjectMutation>(),
             serviceProvider.GetRequiredService<ReviewMutation>(),
            serviceProvider.GetRequiredService<PaymentMutation>(),
            serviceProvider.GetRequiredService<ApplyMutation>(),
            serviceProvider.GetRequiredService<WalletMutation>()
            );
        }

        public class CombinedQuery : ObjectGraphType
        {
            public CombinedQuery(UserQuery userQuery, UserProfileQuery userProfileQuery, NotificationQuery notificationQuery, ContractQuery contractQuery, CategoryQuery categoryQuery, ProjectQuery projectQuery, ReviewQuery reviewQuery, PaymentQuery paymentQuery, ApplyQuery applyQuery, WalletQuery walletQuery)
            {
                foreach (var field in userQuery.Fields)
                {
                    AddField(field);
                }

                foreach (var field in userProfileQuery.Fields)
                {
                    AddField(field);
                }

                foreach (var field in notificationQuery.Fields)
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
                foreach (var field in applyQuery.Fields)
                {
                    AddField(field);
                }
                foreach (var field in walletQuery.Fields)
                {
                    AddField(field);
                }
            }
        }

        public class CombinedMutation : ObjectGraphType
        {
            public CombinedMutation(UserMutation userMutation, UserProfileMutation userProfileMutation, NotificationMutation notificationMutaion, ContractMutation contractMutation, CategoryMutation categoryMutation, ProjectMutation projectMutation, ReviewMutation reviewMutation, PaymentMutation paymentMutation, ApplyMutation applyMutation, WalletMutation walletMutation)
            {
                foreach (var field in userMutation.Fields)
                {
                    AddField(field);
                }

                foreach (var field in userProfileMutation.Fields)
                {
                    AddField(field);
                }

                foreach (var field in notificationMutaion.Fields)
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
                foreach (var field in applyMutation.Fields)
                {
                    AddField(field);
                }
                foreach (var field in walletMutation.Fields)
                {
                    AddField(field);
                }
            }
        }
    }
}