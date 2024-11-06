export type User = {
    id: number;
    username: string;
    passwordHash: string;
    email: string;
    role: string;
    isEmailConfirmed: boolean;
}