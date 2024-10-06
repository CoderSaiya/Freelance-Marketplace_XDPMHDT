using System.Net;
using System.Security.Claims;
using FreelanceMarketplace.Services.Interface;
using FreelanceMarketplace.Security;

namespace FreelanceMarketplace.Middlewares
{
    public class RoleMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RoleMiddleware> _logger;

        public RoleMiddleware(RequestDelegate next, ILogger<RoleMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value.ToLower();
            _logger.LogInformation($"Processing request for path: {path}");

            if (Endpoints.PublicEndpoints.Any(e => path.StartsWith(e)))
            {
                _logger.LogInformation($"Allowing access to public endpoint: {path}");
                await _next(context);
                return;
            }

            if (!context.User.Identity.IsAuthenticated)
            {
                _logger.LogWarning($"Unauthorized access attempt to: {path}");
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Unauthorized");
                return;
            }

            // Check if the token is valid and not expired
            if (!context.User.Identity.IsAuthenticated || context.User.FindFirst("exp") == null)
            {
                _logger.LogWarning("Token expired or invalid");
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Unauthorized");
                return;
            }

            // Use HttpContext.RequestServices to create a scope
            using (var scope = context.RequestServices.CreateScope())
            {
                var userService = scope.ServiceProvider.GetRequiredService<IUserService>();

                // Check for admin role
                if (Endpoints.AdminEndpoints.Any(e => path.StartsWith(e)) && !context.User.IsInRole("Admin"))
                {
                    _logger.LogWarning($"Forbidden access attempt to admin endpoint: {path}");
                    context.Response.StatusCode = 403;
                    await context.Response.WriteAsync("Forbidden");
                    return;
                }

                // Check for freelancer role
                if (Endpoints.FreelancerEndpoints.Any(e => path.StartsWith(e.ToLower())) && !context.User.IsInRole("Freelancer"))
                {
                    context.Response.StatusCode = 403;
                    await context.Response.WriteAsync("Forbidden");
                    return;
                }

                // Check for client role
                if (Endpoints.ClientEndpoints.Any(e => path.StartsWith(e.ToLower())) && !context.User.IsInRole("Client"))
                {
                    context.Response.StatusCode = 403;
                    await context.Response.WriteAsync("Forbidden");
                    return;
                }
            }

            await _next(context);
        }
    }
}
