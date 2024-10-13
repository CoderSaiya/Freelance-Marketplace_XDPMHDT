using FreelanceMarketplace.GraphQL.Authorization;
using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class PaymentQuery : ObjectGraphType
    {
        public PaymentQuery(IServiceProvider serviceProvider)
        {
            AddField(new FieldType
            {
                Name = "payment",
                Type = typeof(ListGraphType<PaymentType>),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();
                    return await paymentService.GetAllPaymentsAsync();
                })
            }.AuthorizeWith("Admin"));

            AddField(new FieldType
            {
                Name = "paymentById",
                Type = typeof(PaymentType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "paymentId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    int paymentId = context.GetArgument<int>("paymentId");
                    using var scope = serviceProvider.CreateScope();
                    var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();
                    return await paymentService.GetPaymentByIdAsync(paymentId);
                })
            }.AuthorizeWith("Admin", "Client", "Freelancer"));

        }

    }
}
