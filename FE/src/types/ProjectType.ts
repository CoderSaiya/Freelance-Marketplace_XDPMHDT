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