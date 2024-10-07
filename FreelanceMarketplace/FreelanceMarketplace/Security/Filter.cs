using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FreelanceMarketplace.Security
{
    public class Filter : AuthorizeAttribute, IAuthorizationFilter
    {
        private readonly string[] _roles;

        public Filter(params string[] roles)
        {
            _roles = roles;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            if (!user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var path = context.HttpContext.Request.Path.Value.ToLower();

            if (_roles.Contains("Admin") && Endpoints.AdminEndpoints.Any(e => path.StartsWith(e.ToLower())))
            {
                if (!user.IsInRole("Admin"))
                {
                    context.Result = new ForbidResult();
                }
            }
            else if (_roles.Contains("Freelancer") && Endpoints.FreelancerEndpoints.Any(e => path.StartsWith(e.ToLower())))
            {
                if (!user.IsInRole("Freelancer"))
                {
                    context.Result = new ForbidResult();
                }
            }
            else if (_roles.Contains("Client") && Endpoints.ClientEndpoints.Any(e => path.StartsWith(e.ToLower())))
            {
                if (!user.IsInRole("Client"))
                {
                    context.Result = new ForbidResult();
                }
            }
        }
    }
}
