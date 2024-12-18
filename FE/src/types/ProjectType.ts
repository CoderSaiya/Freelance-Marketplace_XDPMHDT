import { ApplyType } from "./ApplyType";
import { CategoryType } from "./CategoryType";
import { Contract } from "./ContractType";
import { User } from "./UserType";

export interface ProjectResponseType<T> {
    data: T;
}

export interface ProjectType {
    projectId: number;
    projectName: string;
    projectDescription: string;
    budget: number;
    deadline: string;
    skillRequire: string;
    status: "active" | "completed" | "processing";
    createAt: string;
    users?: User;
    category?: CategoryType;
    applies: ApplyType[];
    contract: Contract;
}

export interface ProjectInput {
    projectName: string;
    projectDescription: string;
    budget: number;
    deadline: string;
    skillRequired: string;
    status: string;
    categoryId: string;
}


export interface ProjectImageResponse {
    data: {
        projects: ProjectWithImage[]
    }
}

export interface ProjectWithImage {
    projectId: number;
    projectName: string;
    projectDescription: string;
    budget: number;
    deadline: Date;
    skillRequire: string;
    status: string;
    createAt: Date;
    avatar: string;
    category: CategoryType;
    imageUrls: string[];
    users: User;
}