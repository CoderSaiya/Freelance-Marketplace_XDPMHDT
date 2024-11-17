export interface Conversation {
    id: number;
    name: string;
    lastMessageTime: string;
}

export interface ConversationListProps {
    conversations: Conversation[];
    onSelectConversation: (conversation: Conversation) => void;
    selectedConversation: Conversation | null;
    isLoading: boolean;
}

export interface ChatWindowProps {
    recipient: string;
    selectedConversation: Conversation | null;
    toggleDetails: () => void;
}

export interface ChatItem {
    id: number;
    sender?: string;
    recipient?: string;
    message?: string;
    timestamp: Date;
}