export interface Review {
    reviewId: number;
    fromUserId: number;
    toUserId: number;
    projectId: number;
    rating: number;
    comment: string;
    createdAt: string;
}