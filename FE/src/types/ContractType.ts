export interface Contract {
    contractId: number;
    projectId: number;
    clientId: number;
    freelancerId: number;
    paymentAmount: number;
    status: 'Active' | 'Completed' | 'Disputed';
    startDate: string;
    endDate: string;
}