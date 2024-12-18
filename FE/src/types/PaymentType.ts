export interface Payment {
    paymentId: number;
    walletId: number;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'project_payment' | 'project_completion';
    status: 'Pending' | 'Completed' | 'Failed';
    createdAt: string;
}
