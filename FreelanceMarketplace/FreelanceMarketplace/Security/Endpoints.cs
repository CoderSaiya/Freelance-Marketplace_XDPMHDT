namespace FreelanceMarketplace.Security
{
    public static class Endpoints
    {
        public static readonly string[] PublicEndpoints =
        {
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/confirm-email",
            "/api/img",
            "/api/auth/refresh-token",
            "/api/auth/signin-google"

        };

        public static readonly string[] AdminEndpoints =
        {
            "/api/chat/send",
            "/api/user",
        };

        public static readonly string[] FreelancerEndpoints =
        {

        };

        public static readonly string[] ClientEndpoints =
        {

        };
    }
}
