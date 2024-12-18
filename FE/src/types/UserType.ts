import { ProjectType } from "./ProjectType";
import { ReviewType } from "./ReviewType";

export type User = {
    id: number;
    username: string;
    passwordHash: string;
    email: string;
    role: string;
    isEmailConfirmed: boolean;
    createAt: string;
    status: string;
    userProfile: UserProfileType;
    projects?: ProjectType[];
    earning?: number;
    reviews: ReviewType[];
}

export interface UserProfileType {
    id: number;
    rating: number;
    company?: string;
    location?: string;
    phone?: string;
    birthday?: Date;
    gender?: string;
    bio?: string;
    skill?: string;
    avatar?: string;
    Industry?: string;
    status: string;
};

export interface UserProfileInput {
    rating: number;
    company: string;
    location: string;
    phone: string;
    birthday: Date;
    gender: string;
    bio: string;
    skill: string;
    avatar: string;
    industry: string;
}