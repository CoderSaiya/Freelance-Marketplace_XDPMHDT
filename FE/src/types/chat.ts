export interface Conversation {
    id: number;
    name: string;
    lastMessageTime: string;
}

export interface ConversationListProps {
    conversations: Conversation[];
    onSelectConversation: (conversation: Conversation) => void;
}

export interface ChatWindowProps {
    recipient: string;
}
