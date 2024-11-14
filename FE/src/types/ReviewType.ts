export interface ReviewType {
    reviewId: number;
    fromUserId: number;
    toUserId: number;
    projectId: number;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReviewInput {
    userId: number;
    contractId: number;
    rating: number;
    feedback?: string;
}