import { CategoryType } from "./CategoryType";
import { User } from "./UserType";

export interface ProjectResponseType {
    data: {
        createProject: {
            projectId: number;
            projectName: string;
            projectDescription: string;
            budget: number;
            deadline: string;
            skillRequire: string;
            status: string;
            user: User;
            category: CategoryType;
        }
    }
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
    category: CategoryType;
    imageUrls: string[];
}