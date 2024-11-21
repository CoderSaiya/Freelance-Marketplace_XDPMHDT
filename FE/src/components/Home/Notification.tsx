import React, { useState, useEffect } from "react";
import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Card } from "@/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { NotificationItem } from "@/types/NotificationType";
import {
  useNotificationsByUserQuery,
  useMarkNotificationAsReadMutation,
} from "@/apis/graphqlApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  createHubConnection,
  stopHubConnection,
} from "@/services/notificationService";

interface Props {
  refetchWallet: () => void;
}

const Notification: React.FC<Props> = ({ refetchWallet }) => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { data, refetch } = useNotificationsByUserQuery(Number(userId));
  const [markNotification] = useMarkNotificationAsReadMutation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleNotification = (notification: NotificationItem) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      refetchWallet();
    };

    createHubConnection("notificationhub", handleNotification);

    return () => stopHubConnection();
  }, [userId]);

  useEffect(() => {
    const transformedNotifications: NotificationItem[] =
      data?.data.notificationsByUser?.map((notification) => ({
        id: notification.id,
        sender: notification.sender.username,
        recipient: notification.receiver.username,
        message: notification.message,
        createdAt: notification.createdAt,
        isRead: notification.isRead,
      })) || [];
    setNotifications(transformedNotifications);
    setUnreadCount(transformedNotifications.filter((n) => !n.isRead).length);
  }, [data?.data.notificationsByUser]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const newTimeoutId = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
    setTimeoutId(newTimeoutId);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    await markNotification(notificationId);
    setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);
    refetch();
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <BellOutlined style={{ fontSize: 25 }} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
      <div
        className={`absolute right-0 mt-2 w-[600px] bg-white rounded-md shadow-lg py-4 px-6 z-50 transform transition-all duration-300 max-h-[400px] overflow-y-auto ${
          isDropdownOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Notifications</h3>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id}>
              <Card className="p-4">
                <div className="flex items-center">
                  <Avatar>
                    <BellOutlined />
                  </Avatar>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-medium">
                        {notification.sender}
                      </h4>
                      <div className="flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-gray-400 text-sm">
                                {formatDistanceToNow(notification.createdAt, {
                                  addSuffix: true,
                                })}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {!notification.isRead ? (
                          <button
                            className="ml-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Mark as Read
                          </button>
                        ) : (
                          <CheckCircleOutlined className="ml-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500">{notification.message}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
