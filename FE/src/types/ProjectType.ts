import { CategoryType } from "./CategoryType";

export interface ProjectResponseType {
    data: {
        createProject: {
            projectId: number;
            projectName: string;
            projectDescription: string;
            budget: number;
            deadline: string;
            skillRequired: string;
            status: string;
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