﻿namespace FreelanceMarketplace.Security
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
            "/api/auth/signin-google",
            "/api/auth/google-response",
            "/graphql",

        };

        public static readonly string[] AdminEndpoints =
        {
            "/api/chat/send",
            "/api/user",
            "/api/chat/history",
        };

        public static readonly string[] FreelancerEndpoints =
        {
            "/api/chat/send",
            "/api/chat/history",
            "/api/stripe/create-payment-intent",
            "/api/stripe/webhook",
            "/notificationhub",
            "/notificationhub/negotiate",
            "/chathub/negotiate",
            "/chathub",
        };

        public static readonly string[] ClientEndpoints =
        {
            "/api/chat/send",
            "/api/chat/history",
            "/api/stripe/create-payment-intent",
            "/api/stripe/webhook",
            "/notificationhub",
            "/notificationhub/negotiate",
            "/chathub/negotiate",
            "/chathub",
        };
    }
}
