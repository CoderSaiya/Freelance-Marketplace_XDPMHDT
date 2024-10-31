using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using FreelanceMarketplace.GraphQL.Authorization;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class NotificationMutation : ObjectGraphType
    {
        public NotificationMutation(INotificationService notificationService)
        {
            // Create notification - Only Admin can create notifications
            AddField(new FieldType
            {
                Name = "createNotification",
                Type = typeof(NotificationType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "message" },
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var notification = new Notification
                    {
                        Message = context.GetArgument<string>("message"),
                        UserId = context.GetArgument<int>("userId")
                    };
                    return await notificationService.CreateNotificationAsync(notification);
                })
            }.AuthorizeWith("Admin"));

            // Mark notification as read - Only the notification recipient (Client/Freelancer) can mark as read
            AddField(new FieldType
            {
                Name = "markNotificationAsRead",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await notificationService.MarkNotificationAsReadAsync(id);
                })
            }.AuthorizeWith("Admin", "Freelancer", "Client")); // Allow all authenticated users since ownership check should be done in service

            // Delete notification - Only Admin can delete notifications
            AddField(new FieldType
            {
                Name = "deleteNotification",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await notificationService.DeleteNotificationAsync(id);
                })
            }.AuthorizeWith("Admin"));
        }
    }
}
