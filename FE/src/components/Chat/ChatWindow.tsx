import React, { useEffect, useState } from "react";
import { startSignalRConnection } from "../../services/signalRService";
import {
  useGetChatHistoryQuery,
  useSendMessageMutation,
} from "../../apis/restfulApi";
import { SendOutlined } from "@ant-design/icons";
import { ChatMessage } from "../../types/ChatMessage";
import { ChatWindowProps } from "../../types/chat";
import { jwtDecode } from "jwt-decode";

const ChatWindow: React.FC<ChatWindowProps> = ({ recipient }) => {
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");

  const decodedToken: any = jwtDecode(token);
  const userId =
    decodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];
  const username =
    decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

  const [sendMessage] = useSendMessageMutation();
  const {
    data: messages,
    refetch: refetchChatHistory,
    error,
    isLoading,
  } = useGetChatHistoryQuery({ user1: username, user2: recipient });

  const handelSend = async () => {
    if (message.trim() === "") return;

    try {
      await sendMessage({
        sender: username,
        recipient: recipient,
        message,
      }).unwrap();
      setMessage("");
      refetchChatHistory();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    startSignalRConnection((user, message) => {
      refetchChatHistory();
    });
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Container for messages */}
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

      {/* Chat input at the bottom */}
      <div className="flex absolute bottom-0 left-0 right-0 px-4 bg-white border-t border-gray-300 mb-40">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <div onClick={handelSend} className="cursor-pointer">
          <SendOutlined />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
