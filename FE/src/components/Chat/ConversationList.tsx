import React from "react";
import { ConversationListProps } from "../../types/chat";
import { Clock, MessageSquare } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
}) => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/");
  }
  return (
    // <div className="w-1/4 h-full border-r p-4 overflow-y-auto">
    //   <div className="mb-4">
    //     <h3>Messages</h3>
    //   </div>
    //   <div className="space-y-4">
    //     {/* Dummy Data */}
    //     {conversations.map((conversation) => (
    //       <div
    //         key={conversation.id}
    //         className="p-2 border rounded cursor-pointer hover:bg-gray-100"
    //         onClick={() => onSelectConversation(conversation)}
    //       >
    //         <p>{conversation.name}</p>
    //         <small>{conversation.lastMessageTime}</small>
    //       </div>
    //     ))}
    //     {/* <div className="p-2 border rounded cursor-pointer hover:bg-gray-100">
    //       <p>Jenny Scott</p>
    //       <small>12:01pm</small>
    //     </div>
    //     <div className="p-2 border rounded cursor-pointer hover:bg-gray-100">
    //       <p>Jane Smith</p>
    //       <small>Yesterday</small>
    //     </div>
    //     <div className="p-2 border rounded cursor-pointer hover:bg-gray-100">
    //       <p>Johna Scott</p>
    //       <small>05/05/23</small>
    //     </div> */}
    //   </div>
    // </div>
    <div className="w-80 border-r bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <img src="img/logo.png" width="40" className="cursor-pointer" onClick={handleHome}/>
          <MessageSquare className="h-5 w-5" />
          <h2 className="font-semibold">Messages</h2>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-2">
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`mb-2 cursor-pointer transition-colors hover:bg-slate-50 ${
                selectedConversation?.id === conversation.id
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
                      {conversation.lastMessageTime}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
