﻿using FreelanceMarketplace.Models;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class ReviewType : ObjectGraphType<Review>
    {
        public ReviewType()
        {
            Field(r => r.ReviewId);
            Field(r => r.Rating);
            Field(r => r.Feedback);

            //Field<UserType>("user").Resolve(context => context.Source.User);
            //Field<ContractType>("contract").Resolve(context => context.Source.Contract);
        }
    }
}
