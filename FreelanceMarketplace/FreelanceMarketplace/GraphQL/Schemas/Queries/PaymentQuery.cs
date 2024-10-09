using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class PaymentQuery : ObjectGraphType
    {
        public PaymentQuery(IServiceProvider serviceProvider)
        {
            Field<ListGraphType<PaymentType>>("payment")
                .ResolveAsync(async context =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();
                    return await paymentService.GetAllPaymentsAsync();
                });

            Field<PaymentType>("paymentById")
                .Arguments(new QueryArguments(new QueryArgument<IntGraphType> { Name = "paymentId" }))
                .ResolveAsync(async context =>
                {
                    int paymentId = context.GetArgument<int>("paymentId");
                    using var scope = serviceProvider.CreateScope();
                    var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();
                    return await paymentService.GetPaymentByIdAsync(paymentId);
                });

        }

    }
}
