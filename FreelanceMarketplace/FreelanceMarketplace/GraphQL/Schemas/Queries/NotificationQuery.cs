using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class NotificationQuery : ObjectGraphType
    {
        public NotificationQuery(INotificationService notificationService)
        {
            Field<NotificationType>("notification")
                .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }))
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await notificationService.GetNotificationByIdAsync(id);
                });

            Field<ListGraphType<NotificationType>>("notificationsByUser")
                .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }))
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await notificationService.GetNotificationsByUserIdAsync(userId);
                });
        }
    }
}
