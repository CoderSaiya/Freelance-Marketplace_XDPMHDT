import React, { useEffect, useState } from "react";
import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";
import DetailsPanel from "../components/Chat/DetailsPanel";
import { Conversation } from "../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetConversationsQuery } from "@/apis/restfulApi";
import { useSearchParams } from "react-router-dom";

const Chat: React.FC = () => {
  const [searchParams] = useSearchParams();
  const receiver = searchParams.get("receiver");
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

  const toggleDetails = () => setShowDetails((prev) => !prev);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  console.log(receiver);

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
