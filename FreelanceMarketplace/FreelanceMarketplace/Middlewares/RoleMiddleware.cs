using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace FreelanceMarketplace.Middlewares
{
    public class RoleMiddleware
    {
        private readonly RequestDelegate _next;

        public RoleMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.User.Identity?.IsAuthenticated ?? false)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await context.Response.WriteAsync("Unauthorized access. Please log in.");
                return;
            }

            var role = context.User.FindFirst(ClaimTypes.Role)?.Value;

            if (role == null || (role != "Admin" && role != "Freelancer" && role != "Client"))
            {
                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                await context.Response.WriteAsync("Access forbidden: You do not have the right role.");
                return;
            }

            await _next(context);
        }
    }
}
