import { Payment } from "./PaymentType";

export interface Wallet {
    id: number;
    userId: number;
    balance: number;
    transactions: Payment[];
}