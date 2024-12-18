using FreelanceMarketplace.Models;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ContractType : ObjectGraphType<Contracts>
    {
        public ContractType()
        {
            Field(x => x.ContractId);
            Field(x => x.ContractDate, type: typeof(DateTimeGraphType));
            Field(x => x.EndDate, type: typeof(DateTimeGraphType));
            Field(x => x.PaymentAmount);
            Field(x => x.Status);
            Field(x => x.FilePath);

            Field<ProjectType>("project").Resolve(context => context.Source.Project);
            Field<UserType>("freelancer").Resolve(context => context.Source.Freelancer);
            Field<UserType>("client").Resolve(context => context.Source.Client);
            //Field<PaymentType>("payment").Resolve(context => context.Source.Payment);
            //Field<ListGraphType<ReviewType>>("reviews").Resolve(context => context.Source.Reviews);
        }
    }
}
