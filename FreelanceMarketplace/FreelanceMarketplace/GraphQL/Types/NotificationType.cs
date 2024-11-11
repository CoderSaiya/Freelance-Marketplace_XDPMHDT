using FreelanceMarketplace.Models;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class NotificationType : ObjectGraphType<Notification>
    {
        public NotificationType()
        {
            Field(x => x.Id);
            Field(x => x.SenderId);
            Field(x => x.ReceiverId);
            Field(x => x.Message);
            Field(x => x.CreatedAt);
            Field(x => x.IsRead);

            Field<UserType>("sender");
            Field<UserType>("receiver");
        }
    }
}
