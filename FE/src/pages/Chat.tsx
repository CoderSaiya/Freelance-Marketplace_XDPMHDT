import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";
import DetailsPanel from "../components/Chat/DetailsPanel";

const Chat: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails((prev) => !prev);

  return (
    <div className="flex h-screen">
      <ConversationList />
      <div className="flex-1 flex flex-col border-l border-r relative">
        <header className="flex justify-between items-center p-4 border-b">
          <h2>Jenny Scott</h2>
          <div className="flex items-center">
            <span className="text-green-500">Online</span>
            <FaBars onClick={toggleDetails} className="ml-4 cursor-pointer" />
          </div>
        </header>
        <ChatWindow />
      </div>
      <DetailsPanel show={showDetails} onClose={toggleDetails} />
    </div>
  );
};

export default Chat;
