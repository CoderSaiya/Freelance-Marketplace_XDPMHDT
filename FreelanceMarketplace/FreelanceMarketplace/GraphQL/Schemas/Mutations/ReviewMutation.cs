using FreelanceMarketplace.GraphQL.Authorization;
using FreelanceMarketplace.GraphQL.Types;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Services.Interfaces;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.VisualBasic;

namespace FreelanceMarketplace.GraphQL.Schemas.Mutations
{
    public class ReviewMutation : ObjectGraphType
    {
        public ReviewMutation(IReviewService reviewService ) 
        {
            AddField(new FieldType
            {
                Name = "createReview",
                Type = typeof(ReviewType),
                Arguments = new QueryArguments(
                new QueryArgument<NonNullGraphType<ReviewInputType>> { Name = "review" }
            ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var input = context.GetArgument<Review>("review");
                    return await reviewService.CreateReviewAsync(input);
                })
            }.AuthorizeWith("Client", "Admin"));

            AddField(new FieldType
            {
                Name = "updateReview",
                Type = typeof(ReviewType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "reviewId" },
                    new QueryArgument<NonNullGraphType<ReviewInputType>> { Name = "review" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var reviewId = context.GetArgument<int>("reviewId");
                    var input = context.GetArgument<Review>("Review");
                    return await reviewService.UpdateReviewAsync(reviewId, input);
                })
            }.AuthorizeWith("Admin","Client"));

            AddField(new FieldType
            {
                Name = "deleteReview",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "reviewId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var reviewId = context.GetArgument<int>("reviewId");
                    return await reviewService.DeleteReviewAsync(reviewId);
                })
            }.AuthorizeWith("Admin", "Client"));
        }
    }
}

