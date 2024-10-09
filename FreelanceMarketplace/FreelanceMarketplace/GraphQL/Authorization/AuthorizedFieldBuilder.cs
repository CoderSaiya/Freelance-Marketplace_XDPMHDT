using System;
using GraphQL.Types;
using GraphQL.Resolvers;
using GraphQL;

namespace FreelanceMarketplace.GraphQL.Authorization
{
    public static class AuthorizedFieldBuilder
    {
        public static FieldType AuthorizeWith(this FieldType field, params string[] roles)
        {
            var authorizeAttribute = new AuthorizeRolesAttribute(roles);
            var originalResolver = field.Resolver;

            field.Resolver = new FuncFieldResolver<object>(context =>
            {
                if (!authorizeAttribute.Authorize(context))
                {
                    context.Errors.Add(new ExecutionError("You do not have permission to access this resource."));
                    return null;
                }

                return originalResolver.ResolveAsync(context);
            });

            return field;
        }
    }
}
