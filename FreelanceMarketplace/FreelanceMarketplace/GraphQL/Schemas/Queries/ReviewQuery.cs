using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;
using Microsoft.VisualBasic;

namespace FreelanceMarketplace.GraphQL.Schemas.Queries
{
    public class ReviewQuery : ObjectGraphType
    {
        public ReviewQuery(IServiceProvider serviceProvider)
        {
            Field<ListGraphType<ReviewType>>("review")
                .ResolveAsync(async context =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var reviewService = scope.ServiceProvider.GetRequiredService<IReviewService>();
                    return await reviewService.GetAllReviewsAsync();
                });

            Field<ReviewType>("reviewById")
                .Arguments(new QueryArguments(new QueryArgument<IntGraphType> { Name = "reviewId" }))
                .ResolveAsync(async context =>
                {
                    int reviewId = context.GetArgument<int>("reviewId");
                    using var scope = serviceProvider.CreateScope();
                    var reviewService = scope.ServiceProvider.GetRequiredService<IReviewService>();
                    return await reviewService.GetReviewByIdAsync(reviewId);
                });
        }

    }
}
