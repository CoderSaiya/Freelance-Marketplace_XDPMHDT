export interface ApplyType {
    applyId: number;
    projectId: number;
    userId: number;
    duration: number;
    status: 'Pending' | 'Accepted' | 'Rejected';
}

export interface ApplyInput {
    userId: number;
    projectId: number;
    duration: number;
    status: 'Pending' | 'Accepted' | 'Rejected';
}