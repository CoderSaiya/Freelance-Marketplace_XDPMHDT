using GraphQL;
using System.Security.Claims;

namespace FreelanceMarketplace.GraphQL.Authorization
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
    public class AuthorizeRolesAttribute : Attribute
    {
        public string[] Roles { get; }

        public AuthorizeRolesAttribute(params string[] roles)
        {
            Roles = roles;
        }

        public bool Authorize(IResolveFieldContext context)
        {
            if (context.UserContext.ContainsKey("User"))
            {
                var user = context.UserContext["User"] as ClaimsPrincipal;
                return user != null && Roles.Any(role => user.IsInRole(role));
            }
            return false;
        }
    }
}
