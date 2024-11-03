using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using FreelanceMarketplace.GraphQL.Authorization;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class NotificationQuery : ObjectGraphType
    {
        public NotificationQuery(INotificationService notificationService)
        {
            // Single notification - Only the owner (Client/Freelancer) or Admin should see it
            AddField(new FieldType
            {
                Name = "notification",
                Type = typeof(NotificationType),
                Arguments = new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await notificationService.GetNotificationByIdAsync(id);
                })
            }.AuthorizeWith("Admin", "Freelancer", "Client")); // Allow all authenticated users since ownership check should be done in service

            // Notifications by user - Only the owner (Client/Freelancer) or Admin should see them
            AddField(new FieldType
            {
                Name = "notificationsByUser",
                Type = typeof(ListGraphType<NotificationType>),
                Arguments = new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await notificationService.GetNotificationsByUserIdAsync(userId);
                })
            }.AuthorizeWith("Admin", "Freelancer", "Client")); // Allow all authenticated users since ownership check should be done in service
        }
    }
}
