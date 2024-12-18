import React from "react";
import { ConversationListProps } from "../../types/chat";
import { Clock, MessageSquare } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  isLoading,
}) => {
  return (
    <div className="w-80 border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" /> Messages
        </h2>
      </div>
      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : conversations.length > 0 ? (
            conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`mb-2 cursor-pointer transition-colors hover:bg-slate-50 ${
                  selectedConversation?.name === conversation.name
                    ? "bg-slate-100"
                    : ""
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.name}`}
                      />
                      <AvatarFallback>
                        {conversation.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{conversation.name}</p>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(conversation.lastMessageTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No conversations yet.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
