export interface ReviewType {
    reviewId?: number;
    senderId: number;
    recipientId: number;
    contractId: number;
    rating: number;
    feedback: string;
    createdAt?: string;
}

export interface ReviewInput {
    senderId: number;
    recipientId: number;
    contractId: number;
    rating: number;
    feedback?: string;
}