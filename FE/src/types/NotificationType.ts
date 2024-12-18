import { User } from "./UserType";

export interface NotificationItem {
  id: number;
  sender: string;
  recipient: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationType {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  senderId: number;
  receiverId: number;
  sender: User;
  receiver: User;
}