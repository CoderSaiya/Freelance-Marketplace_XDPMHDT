using FreelanceMarketplace.Models;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class PaymentType : ObjectGraphType<Payment>
    {
        public PaymentType()
        {
            Field(p => p.PaymentId);
            Field(p => p.Amount);
            Field(p => p.Description);
            Field(p => p.Status);

            Field<ContractType>("contract").Resolve(context => context.Source.Contract);
        }
    }
}
