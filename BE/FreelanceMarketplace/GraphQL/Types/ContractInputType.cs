using GraphQL.Types;
using System.Xml.Linq;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ContractInputType : InputObjectGraphType
    {
        public ContractInputType()
        {
            Name = "ContractInput";
            Field<NonNullGraphType<IntGraphType>>("projectId");
            Field<NonNullGraphType<IntGraphType>>("freelancerId");
            Field<NonNullGraphType<IntGraphType>>("clientId");
            Field<NonNullGraphType<DateTimeGraphType>>("endDate");
            Field<NonNullGraphType<FloatGraphType>>("paymentAmount");
            Field<StringGraphType>("status");
        }
    }
}
