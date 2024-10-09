using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interface;
using GraphQL;
using GraphQL.Types;
using Microsoft.VisualBasic;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class ReviewMutation : ObjectGraphType
    {
        public ReviewMutation(IReviewService reviewService ) 
        {
            Field<ReviewType>("createReview")
                .Argument<NonNullGraphType<ReviewInputType>>("review")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<Review>("review");
                    return await reviewService.CreateReviewAsync(input);
                });

            Field<ReviewType>("updateReview")
                .Argument<NonNullGraphType<IntGraphType>>("reviewId")
                .Argument<NonNullGraphType<ReviewInputType>>("review")
                .ResolveAsync(async context =>
                {
                    var reviewId = context.GetArgument<int>("reviewId");
                    var input = context.GetArgument<Review>("review");
                    return await reviewService.UpdateReviewAsync(reviewId, input);
                });

            Field<BooleanGraphType>("deleteReview")
                .Argument<NonNullGraphType<IntGraphType>>("reviewId")
                .ResolveAsync(async context =>
                {
                    var reviewId = context.GetArgument<int>("reviewId");
                    return await reviewService.DeleteReviewAsync(reviewId);
                });
        }
    }
}

