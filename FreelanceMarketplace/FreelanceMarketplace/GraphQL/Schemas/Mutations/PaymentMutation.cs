using FreelanceMarketplace.GraphQL.Authorization;
using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class PaymentMutation : ObjectGraphType
    {
        public PaymentMutation(IPaymentService paymentService)
        {
            AddField(new FieldType
            {
                Name = "createPayment",
                Type = typeof(PaymentType),
                Arguments = new QueryArguments(
                   new QueryArgument<NonNullGraphType<PaymentInputType>> { Name = "payment" }
             ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var input = context.GetArgument<Payment>("payment");
                    return await paymentService.CreatePaymentAsync(input);
                })
            }.AuthorizeWith("Client", "Admin", "Freelancer"));

            AddField(new FieldType
            {
                Name = "updatePayment",
                Type = typeof(PaymentType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "paymentId" },
                    new QueryArgument<NonNullGraphType<PaymentInputType>> { Name = "payment" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var paymentId = context.GetArgument<int>("paymentId");
                    var input = context.GetArgument<Payment>("payment");
                    return await paymentService.UpdatePaymentAsync(paymentId, input);
                })
            }.AuthorizeWith("Admin"));

            AddField(new FieldType
            {
                Name = "deletePayment",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "paymentId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var paymentId = context.GetArgument<int>("paymentId");
                    return await paymentService.DetetePaymentAsync(paymentId);
                })
            }.AuthorizeWith("Admin"));

            AddField(new FieldType
            {
                Name = "refundPayment",
                Type = typeof(PaymentType),
                Arguments = new QueryArguments(
                   new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "paymentId" }
               ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var paymentId = context.GetArgument<int>("paymentId");
                    return await paymentService.RefundPaymentAsync(paymentId);
                })
            }.AuthorizeWith("Client", "Admin", "Freelancer"));
        }
    }
}
