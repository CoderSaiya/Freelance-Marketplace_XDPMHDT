export interface Conversation {
    id: number;
    name: string;
    lastMessageTime: string;
}

export interface ConversationListProps {
    conversations: Conversation[];
    onSelectConversation: (conversation: Conversation) => void;
    selectedConversation: Conversation | null
}

export interface ChatWindowProps {
    recipient: string;
    selectedConversation: Conversation | null;
    toggleDetails: () => void;
}
