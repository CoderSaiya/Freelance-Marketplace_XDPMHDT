using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class PaymentMutation : ObjectGraphType  
    {
        public PaymentMutation(IPaymentService paymentService) 
        {
            Field<PaymentType>("createPayment")
                .Argument<NonNullGraphType<PaymentInputType>>("payment")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<Payment>("payment");
                    return await paymentService.CreatePaymentAsync(input);
                });

            Field<PaymentType>("updatePayment")
                .Argument<NonNullGraphType<IntGraphType>>("paymentId")
                .Argument<NonNullGraphType<PaymentInputType>>("payment")
                .ResolveAsync(async context =>
                {
                    var paymentId = context.GetArgument<int>("paymentId");
                    var input = context.GetArgument<Payment>("payment");
                    return await paymentService.UpdatePaymentAsync(paymentId, input);

                });

            Field<BooleanGraphType>("deletePayment")
                .Argument<NonNullGraphType<IntGraphType>>("paymentId")
                .ResolveAsync(async context =>
                {
                    var paymentId = context.GetArgument<int>("paymentId");
                    return await paymentService.DetetePaymentAsync(paymentId);
                });
        }
    }
}
