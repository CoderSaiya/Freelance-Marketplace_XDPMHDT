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
            /*
            Field<NotificationType>("createNotification")
                .Arguments(
                    new QueryArguments(
                        new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "message" },
                        new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }
                    )
                )
                .ResolveAsync(async context =>
                {
                    var notification = new Notification
                    {
                        Message = context.GetArgument<string>("message"),
                        UserId = context.GetArgument<int>("userId")
                    };
                    return await notificationService.CreateNotificationAsync(notification);
                });

            Field<BooleanGraphType>("markNotificationAsRead")
                .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }))
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await notificationService.MarkNotificationAsReadAsync(id);
                });

            Field<BooleanGraphType>("deleteNotification")
                .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }))
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await notificationService.DeleteNotificationAsync(id);
                });
            */
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
            }.AuthorizeWith("User"));

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
            }.AuthorizeWith("User"));

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
