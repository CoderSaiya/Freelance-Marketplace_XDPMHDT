using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class PaymentInputType :  InputObjectGraphType
    {
        public PaymentInputType()
        {
            Name = "PaymentInput";
            Field<NonNullGraphType<IntGraphType>>("paymentId");
            Field<NonNullGraphType< IntGraphType >> ("contractId");
            Field<NonNullGraphType<IntGraphType>>("amount");
            Field<StringGraphType>("description");
            Field<StringGraphType>("status");

        }
    }
}
