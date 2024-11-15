import React, { useState } from "react";
import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";
import DetailsPanel from "../components/Chat/DetailsPanel";
import { Conversation } from "../types/chat";

const Chat: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConversation, setSelectedConversation] = 
    useState<Conversation | null>(null);

  const conversations: Conversation[] = [
    { id: 1, name: "client1", lastMessageTime: "12:01pm" },
    { id: 2, name: "Jane Smith", lastMessageTime: "Yesterday" },
    { id: 3, name: "Johna Scott", lastMessageTime: "05/05/23" },
  ];

  const toggleDetails = () => setShowDetails((prev) => !prev);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <ConversationList
        selectedConversation={selectedConversation}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
      />
      <ChatWindow 
        recipient={selectedConversation?.name || ""} 
        selectedConversation={selectedConversation}
        toggleDetails={toggleDetails}
      />
      <DetailsPanel show={showDetails} onClose={toggleDetails} selectedConversation={selectedConversation} />
    </div>
  );
};

export default Chat;