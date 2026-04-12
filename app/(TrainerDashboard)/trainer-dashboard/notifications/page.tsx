"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Sparkles, 
  Dumbbell, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  Trash2,
  Bell,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkSingleAsReadMutation, useDeleteSingleNotificationMutation, useDeleteAllNotificationsMutation } from "@/redux/features/api/userDashboard/notificationApi";
import { toast } from "sonner";

const getNotificationIcon = (type: string | null) => {
  const t = type?.toLowerCase() || "";
  if (t === "insight_msg" || t.includes("insight") || t.includes("ai")) return <Sparkles size={24} className="text-[#F59E0B]" />;
  if (t.includes("program") || t.includes("workout")) return <Dumbbell size={24} className="text-[#3A86FF]" />;
  if (t.includes("motivation") || t.includes("message")) return <MessageCircle size={24} className="text-[#A855F7]" />;
  if (t.includes("reminder") || t.includes("check-in")) return <Clock size={24} className="text-[#EF4444]" />;
  if (t.includes("approval") || t.includes("goal")) return <CheckCircle2 size={24} className="text-[#10B981]" />;
  return <Bell size={24} className="text-[#6366F1]" />; 
};

const getNotificationIconBg = (type: string | null) => {
  const t = type?.toLowerCase() || "";
  if (t === "insight_msg" || t.includes("insight") || t.includes("ai")) return "bg-[#F59E0B]/10";
  if (t.includes("program") || t.includes("workout")) return "bg-[#3A86FF]/10";
  if (t.includes("motivation") || t.includes("message")) return "bg-[#A855F7]/10";
  if (t.includes("reminder") || t.includes("check-in")) return "bg-[#EF4444]/10";
  if (t.includes("approval") || t.includes("goal")) return "bg-[#10B981]/10";
  return "bg-[#6366F1]/10"; 
};

export default function TrainerNotificationsPage() {
  const { data: response, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markSingleAsRead] = useMarkSingleAsReadMutation();
  const [deleteSingleNotification] = useDeleteSingleNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  const notifications = response?.data || [];

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

  const handleClearAll = async () => {
    try {
      await deleteAllNotifications().unwrap();
      toast.success("All notifications cleared");
    } catch (err) {
      console.error("Failed to clear notifications", err);
      toast.error("Failed to clear notifications");
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
      toast.error("Failed to delete notification");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0FA4A9]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-6 md:p-8 max-w-5xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F2D2E] mb-2">Notifications</h1>
          <p className="text-[#5F6F73]">Stay updated with client activity, messages, and system alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllAsRead}
            className="bg-[#0FA4A9] text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors text-sm cursor-pointer"
          >
            Mark all as read
          </button>
          <button
            onClick={handleClearAll}
            className="bg-red-50 text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm cursor-pointer"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {notifications.map((notif, index) => (
            <motion.div
              layout
              key={notif.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className={cn(
                "bg-white rounded-2xl p-5 md:p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center gap-4 group hover:border-[#0FA4A9]/50 transition-all cursor-pointer relative",
                notif.read_at ? "border-gray-100" : "border-blue-100 bg-blue-50/50"
              )}
              onClick={() => {
                if (!notif.read_at) {
                  handleMarkSingleAsRead(notif.id);
                }
              }}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                  getNotificationIconBg(notif.type)
                )}
              >
                {getNotificationIcon(notif.type)}
              </div>
              <div className="flex flex-col gap-1.5 flex-1 pr-12 sm:pr-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-[#1F2D2E] leading-tight flex items-center gap-2">
                    {notif.title || "Notification"}
                    {!notif.read_at && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                    )}
                  </h3>
                  <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider shrink-0 hidden sm:block">
                    {notif.created_at_formatted}
                  </span>
                </div>
                <p className="text-[#5F6F73] text-sm md:text-base leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider shrink-0 sm:hidden mt-2">
                  {notif.created_at_formatted}
                </span>
              </div>
              
              {/* Action Icons */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 flex items-center gap-2 ml-4">
                <div 
                  className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSingleNotification(notif.id);
                  }}
                  title="Delete notification"
                >
                  <Trash2 size={18} />
                </div>
                <div className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 group-hover:border-[#0FA4A9] group-hover:text-[#0FA4A9] transition-all hidden sm:flex">
                  <ChevronRight size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-12 border border-gray-100 flex flex-col items-center justify-center gap-4 text-center mt-4"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2D2E] mb-1">You're all caught up!</h3>
              <p className="text-[#5F6F73]">No new notifications at the moment.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
