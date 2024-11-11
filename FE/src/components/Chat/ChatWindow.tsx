import React, { useEffect, useState } from "react";
import {
  createHubConnection,
  sendHubMessage,
  stopHubConnection,
} from "../../services/signalRService";
import {
  useGetChatHistoryQuery,
  useSendMessageMutation,
} from "../../apis/restfulApi";
import { SendOutlined } from "@ant-design/icons";
import { ChatMessage } from "../../types/ChatMessage";
import { ChatWindowProps } from "../../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ChatWindow: React.FC<ChatWindowProps> = ({ recipient }) => {
  const [message, setMessage] = useState("");

  const userId = useSelector((state: RootState) => state.auth.userId);
  const username = useSelector((state: RootState) => state.auth.username);

  const [sendMessage] = useSendMessageMutation();
  const {
    data: messages,
    refetch: refetchChatHistory,
    isLoading,
  } = useGetChatHistoryQuery({ user1: username, user2: recipient });

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      await sendMessage({ sender: username, recipient, message }).unwrap();
      setMessage("");
      refetchChatHistory();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (
      event: string,
      user: string,
      message: string
    ) => {
      if (event === "ReceiveMessage") {
        refetchChatHistory();
      }
    };

    createHubConnection("chatHub", handleReceiveMessage);

    return () => {
      stopHubConnection("chatHub");
    };
  }, [refetchChatHistory]);

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 items-end max-h-[70%]">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          messages?.map((msg: ChatMessage) => (
            <div
              key={msg.id}
              className={`${
                msg.senderId === userId
                  ? "self-end bg-blue-500 text-white"
                  : "self-start bg-gray-200"
              } p-2 rounded-lg max-w-xs`}
            >
              <p>{msg.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Chat input */}
      <div className="flex absolute bottom-0 left-0 right-0 px-4 bg-white border-t border-gray-300 mb-40">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <div onClick={handleSend} className="cursor-pointer">
          <SendOutlined />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
