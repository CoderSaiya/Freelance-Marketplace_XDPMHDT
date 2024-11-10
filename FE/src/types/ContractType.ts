export interface Contract {
    contractId: number;
    projectId: number;
    clientId: number;
    freelancerId: number;
    paymentAmount: number;
    status: 'Pending' | 'Completed' | 'Disputed';
    startDate: string;
    endDate: string;
    filePath: string;
}