import { User } from "./UserType";

export interface ChatMessage {
    id: number,
    sender: User,
    recipient: User,
    message: string,
    timestamp: Date
}