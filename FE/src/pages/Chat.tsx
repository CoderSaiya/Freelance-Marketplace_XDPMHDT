import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
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
    <div className="flex h-screen">
      <ConversationList
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
      />
      <div className="flex-1 flex flex-col border-l border-r relative">
        <header className="flex justify-between items-center p-4 border-b">
          <h2>
            {selectedConversation
              ? selectedConversation.name
              : "Select a conversation"}
          </h2>
          <div className="flex items-center">
            <span className="text-green-500">Online</span>
            <FaBars onClick={toggleDetails} className="ml-4 cursor-pointer" />
          </div>
        </header>
        {selectedConversation ? (
          <ChatWindow recipient={selectedConversation.name} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            Please select a conversation
          </div>
        )}
      </div>
      <DetailsPanel show={showDetails} onClose={toggleDetails} />
    </div>
  );
};

export default Chat;
