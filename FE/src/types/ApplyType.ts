export interface Apply {
    applyId: number;
    projectId: number;
    userId: number;
    duration: number;
    status: 'Pending' | 'Accepted' | 'Rejected';
}