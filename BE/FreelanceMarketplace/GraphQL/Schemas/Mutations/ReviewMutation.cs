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
        public ReviewMutation(IReviewService reviewService)
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
                    var input = context.GetArgument<Dictionary<string, object>>("review");
                    var review = new Review
                    {
                        SenderId = Convert.ToInt32(input["senderId"]),
                        RecipientId = Convert.ToInt32(input["recipientId"]),
                        ContractId = Convert.ToInt32(input["contractId"]),
                        Rating = Convert.ToInt32(input["rating"]),
                        Feedback = input["feedback"].ToString(),
                    };
                    return await reviewService.CreateReviewAsync(review);
                })
            }.AuthorizeWith("Client", "Freelancer"));

            //AddField(new FieldType
            //{
            //    Name = "updateReview",
            //    Type = typeof(ReviewType),
            //    Arguments = new QueryArguments(
            //        new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "reviewId" },
            //        new QueryArgument<NonNullGraphType<ReviewInputType>> { Name = "review" }
            //    ),
            //    Resolver = new FuncFieldResolver<object>(async context =>
            //    {
            //        var reviewId = context.GetArgument<int>("reviewId");
            //        var input = context.GetArgument<Review>("Review");
            //        return await reviewService.UpdateReviewAsync(reviewId, input);
            //    })
            //}.AuthorizeWith("Admin", "Client"));

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

            AddField(new FieldType
            {
                Name = "checkReviewed",
                Type = typeof(BooleanGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "projectId" },
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "userId" }
                ),
                Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var projectId = context.GetArgument<int>("projectId");
                    var userId = context.GetArgument<int>("userId");
                    return await reviewService.CheckReviewed(projectId, userId);
                })
            }.AuthorizeWith("Freelancer", "Client"));
        }
    }
}