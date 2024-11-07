export interface ApplyType {
    applyId: number;
    projectId: number;
    userId: number;
    duration: number;
    status: 'Pending' | 'Accepted' | 'Rejected';
}