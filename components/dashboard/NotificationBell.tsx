"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkSingleAsReadMutation, useDeleteSingleNotificationMutation } from "@/redux/features/api/userDashboard/notificationApi";
import NotificationDropdown from "./NotificationDropdown";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NotificationBellProps {
  className?: string;
  iconSize?: number;
}

export default function NotificationBell({ className, iconSize = 20 }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: response, isLoading, error } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markSingleAsRead] = useMarkSingleAsReadMutation();
  const [deleteSingleNotification] = useDeleteSingleNotificationMutation();

  console.log("NotificationBell - response:", response);
  console.log("NotificationBell - isLoading:", isLoading);
  console.log("NotificationBell - error:", error);

  const notifications = response?.data || [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const handleMarkAllAsRead = async () => {
    try {
      const res = await markAsRead({ all: true }).unwrap();
      if (res.success) {
        toast.success("All notifications marked as read");
      }
    } catch (err) {
      console.error("Failed to mark all as read", err);
      toast.error("Failed to mark all as read");
    }
  };

  const handleMarkSingleAsRead = async (id: string) => {
    try {
      await markSingleAsRead({ notification_id: id }).unwrap();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleDeleteSingleNotification = async (id: string) => {
    try {
      await deleteSingleNotification({ notification_id: id }).unwrap();
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-[#F4FBFA] hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell size={iconSize} className="text-[#5F6F73]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onMarkAllAsRead={handleMarkAllAsRead}
        onMarkSingleAsRead={handleMarkSingleAsRead}
        onDeleteSingleNotification={handleDeleteSingleNotification}
        notifications={notifications}
      />
    </div>
  );
}
