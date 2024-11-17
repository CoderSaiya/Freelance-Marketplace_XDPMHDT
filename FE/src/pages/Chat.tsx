import React, { useEffect, useState } from "react";
import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";
import DetailsPanel from "../components/Chat/DetailsPanel";
import { Conversation } from "../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetConversationsQuery } from "@/apis/restfulApi";
import { useParams } from "react-router-dom";

const Chat: React.FC = () => {
  const { receiver } = useParams<{ receiver?: string }>();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const username = useSelector((state: RootState) => state.auth.username);

  const { data: conversations, isLoading } = useGetConversationsQuery(username);

  useEffect(() => {
    if (receiver && conversations) {
      const conversation = conversations.find(
        (c) => c.name.toLowerCase() === receiver.toLowerCase()
      );
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [receiver, conversations]);

  // const conversations: Conversation[] = [
  //   { id: 1, name: "client1", lastMessageTime: "12:01pm" },
  //   { id: 2, name: "Jane Smith", lastMessageTime: "Yesterday" },
  //   { id: 3, name: "Johna Scott", lastMessageTime: "05/05/23" },
  // ];

  const toggleDetails = () => setShowDetails((prev) => !prev);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <ConversationList
        selectedConversation={selectedConversation}
        conversations={conversations || []}
        onSelectConversation={handleSelectConversation}
        isLoading={isLoading}
      />
      <ChatWindow
        recipient={selectedConversation?.name || ""}
        selectedConversation={selectedConversation}
        toggleDetails={toggleDetails}
      />
      <DetailsPanel
        show={showDetails}
        onClose={toggleDetails}
        selectedConversation={selectedConversation}
      />
    </div>
  );
};

export default Chat;
