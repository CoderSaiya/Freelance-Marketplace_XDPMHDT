import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Conversation } from "@/types/chat";

interface DetailsPanelProps {
  show: boolean;
  onClose: () => void;
  selectedConversation: Conversation | null;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  show,
  onClose,
  selectedConversation,
}) => {
  return (
    <Sheet open={show} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Conversation Details</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={
                      selectedConversation
                        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.name}`
                        : undefined
                    }
                  />
                  <AvatarFallback>
                    <User2 className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">
                    {selectedConversation?.name || "No conversation selected"}
                  </h3>
                  <Badge variant="success" className="mt-2">
                    Online
                  </Badge>
                  <p className="text-sm text-slate-500 mt-2">
                    Last active: {selectedConversation?.lastMessageTime || "N/A"}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Contact Info</h4>
                  <p className="text-sm text-slate-500">
                    Email: {selectedConversation?.name.toLowerCase()}@example.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailsPanel;