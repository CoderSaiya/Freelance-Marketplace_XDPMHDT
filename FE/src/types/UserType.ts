export type User = {
    id: number;
    username: string;
    passwordHash: string;
    email: string;
    role: string;
    isEmailConfirmed: boolean;
    createAt: string;
    userProfile?: UserProfileType;
}

export interface UserProfileType {
    id: number;
    rating: number;
    company?: string;
    location?: string;
    bio?: string;
    skill?: string;
    avatar?: string;
    Industry?: string;
    status: string;
};