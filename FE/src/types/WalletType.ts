import { User } from "./UserType";

export interface WalletType {
    walletId: number;
    userId: number;
    balance: number;
    user: User
}