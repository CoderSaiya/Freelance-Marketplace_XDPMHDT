import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, MessageSquare, Send } from "lucide-react";
import {
  useGetChatHistoryQuery,
  useSendMessageMutation,
} from "../../apis/restfulApi";
import { ChatItem, ChatWindowProps } from "../../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createHubConnection, stopHubConnection } from "@/services/chatService";

const ChatWindow: React.FC<ChatWindowProps> = ({
  recipient,
  selectedConversation,
  toggleDetails,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatItem[]>([]); // Local state for messages
  const username = useSelector((state: RootState) => state.auth.username);

  const [sendMessage] = useSendMessageMutation();
  const {
    data: initialMessages,
  } = useGetChatHistoryQuery({ user1: username, user2: recipient });

  console.log(initialMessages);

  useEffect(() => {
    if (initialMessages) {
      setMessages(
        initialMessages
          .filter(
            (msg) => msg && msg.id && msg.sender && msg.recipient && msg.message
          )
          .map((msg) => ({
            id: msg.id,
            sender: msg.sender.username || "Unknown",
            recipient: msg.recipient.username || "Unknown",
            message: msg.message,
            timestamp: new Date(msg.timestamp),
          }))
      );
    }
  }, [initialMessages]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      const newMessage = await sendMessage({
        sender: username,
        recipient: recipient,
        message: message,
      }).unwrap();

      if (!newMessage || !newMessage.sender || !newMessage.recipient) {
        console.error("Received an invalid message from the API:", newMessage);
        return;
      }
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const handleNotification = (chat: any) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: chat.id || new Date().getTime().toString(),
          sender: chat.sender,
          recipient: recipient,
          message: chat.message,
          timestamp: new Date(chat.timestamp),
        },
      ]);
    };
  
    createHubConnection("chatHub", handleNotification);
  
    return () => stopHubConnection();
  }, [recipient]);

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4 text-slate-500">
        <MessageSquare className="h-12 w-12" />
        <p className="text-lg font-medium">
          Please select a conversation to start messaging
        </p>
      </div>
    );
  }

  console.log(initialMessages);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <header className="h-16 border-b px-6">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.name}`}
              />
              <AvatarFallback>
                {selectedConversation.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{selectedConversation.name}</h2>
              <Badge variant="success" className="mt-1">
                Online
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleDetails}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((msg, index) => (
            <Card
              key={msg.id || index}
              className={`max-w-[80%] ${
                msg.sender === username ? "ml-auto" : "mr-auto"
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`}
                    />
                    <AvatarFallback>
                      {typeof msg.sender === "string"
                        ? msg.sender.substring(0, 2).toUpperCase()
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {msg.sender}
                    </p>
                    <p className="mt-1">{msg.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;