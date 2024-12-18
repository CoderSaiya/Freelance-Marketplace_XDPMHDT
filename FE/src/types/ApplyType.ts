import { ProjectType } from "./ProjectType";
import { User } from "./UserType";

export interface ApplyType {
    applyId: number;
    projectId: number;
    freelancerId: number;
    clientId: number;
    duration: number;
    status: 'Pending' | 'Accepted' | 'Rejected';
    createAt: string;
    freelancer: User;
    client: User;
    project: ProjectType;
}

export interface ApplyInput {
    freelancerId: number;
    clientId: number;
    projectId: number;
    duration: number;
    status: 'Pending' | 'Accepted' | 'Rejected';
}