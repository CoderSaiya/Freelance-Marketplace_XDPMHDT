namespace FreelanceMarketplace
{
    public static class Endpoint
    {
        public static void MapEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("", () => "This is a public endpoint.").AllowAnonymous();

            app.MapGet("/admin", () => "Admin-only endpoint.")
                .RequireAuthorization("AdminOnly");

            app.MapGet("/freelancer", () => "Freelancer-only endpoint.")
                .RequireAuthorization("FreelancerOnly");

            app.MapGet("/client", () => "Client-only endpoint.")
                .RequireAuthorization("ClientOnly");
        }
    }
}
