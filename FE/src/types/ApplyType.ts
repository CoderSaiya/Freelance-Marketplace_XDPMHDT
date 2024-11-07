export interface ApplyType {
    applyId: number;
    projectId: number;
    freelancerId: number;
    clientId: number;
    duration: number;
    status: 'Pending' | 'Accepted' | 'Rejected';
}

export interface ApplyInput {
    freelancerId: number;
    clientId: number;
    projectId: number;
    duration: number;
    status: 'Pending' | 'Accepted' | 'Rejected';
}