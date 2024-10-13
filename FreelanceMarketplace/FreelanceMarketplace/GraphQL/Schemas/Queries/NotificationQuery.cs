using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
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
            /*
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
            */
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
            }.AuthorizeWith("User"));

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
            }.AuthorizeWith("User"));
        }
    }
}
