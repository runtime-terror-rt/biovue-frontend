"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, Dumbbell, Clock, CheckCircle2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type Notification = {
  id: string;
  title: string | null;
  type: string | null;
  message: string;
  created_at: string;
  created_at_formatted: string;
  read_at: string | null;
};

// MOCK_NOTIFICATIONS removed to favor dynamic data

const getNotificationIcon = (type: string | null) => {
  const t = type?.toLowerCase() || "";
  if (t === "insight_msg" || t.includes("insight") || t.includes("ai")) return <Sparkles size={20} className="text-[#F59E0B]" />;
  if (t.includes("program") || t.includes("workout")) return <Dumbbell size={20} className="text-[#3A86FF]" />;
  if (t.includes("motivation") || t.includes("message")) return <MessageCircle size={20} className="text-[#A855F7]" />;
  if (t.includes("reminder") || t.includes("check-in")) return <Clock size={20} className="text-[#EF4444]" />;
  if (t.includes("approval") || t.includes("goal")) return <CheckCircle2 size={20} className="text-[#10B981]" />;
  return <Bell size={20} className="text-[#6366F1]" />; // Default icon
};

const getNotificationIconBg = (type: string | null) => {
  const t = type?.toLowerCase() || "";
  if (t === "insight_msg" || t.includes("insight") || t.includes("ai")) return "bg-[#F59E0B]/10";
  if (t.includes("program") || t.includes("workout")) return "bg-[#3A86FF]/10";
  if (t.includes("motivation") || t.includes("message")) return "bg-[#A855F7]/10";
  if (t.includes("reminder") || t.includes("check-in")) return "bg-[#EF4444]/10";
  if (t.includes("approval") || t.includes("goal")) return "bg-[#10B981]/10";
  return "bg-[#6366F1]/10"; // Default bg
};

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkSingleAsRead: (id: string) => void;
  onDeleteSingleNotification: (id: string) => void;
  notifications: Notification[];
}

import { Bell } from "lucide-react";

export default function NotificationDropdown({ isOpen, onClose, onMarkAllAsRead, onMarkSingleAsRead, onDeleteSingleNotification, notifications }: NotificationDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile or capturing clicks outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-14 right-6 w-[400px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-[#F9FAFB] border-b border-gray-100">
              <h3 className="text-xl font-medium text-[#1F2D2E]">Recent</h3>
              <button
                onClick={onMarkAllAsRead}
                className="text-[#3A86FF] text-sm font-medium hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-2 flex flex-col">
              <AnimatePresence>
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    layout // For smooth layout shifting when items are removed or change state
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    onClick={() => {
                      if (!notif.read_at) {
                        onMarkSingleAsRead(notif.id);
                      }
                    }}
                    className={cn(
                      "group flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border-b border-gray-50 last:border-0",
                      !notif.read_at && "bg-blue-50/30"
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        getNotificationIconBg(notif.type)
                      )}
                    >
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex flex-col gap-1 flex-1 relative pr-6">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-base font-medium text-[#1F2D2E] leading-tight pr-2">
                          {notif.title || "Notification"}
                        </h4>
                        <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider shrink-0 mt-0.5">
                          {notif.created_at_formatted}
                        </span>
                      </div>
                      <p className="text-sm text-[#5F6F73] leading-relaxed">
                        {notif.message}
                      </p>
                      {/* Delete Icon */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSingleNotification(notif.id);
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete notification"
                      >
                        <Trash2 size={16} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {notifications.length === 0 && (
                <div className="p-8 text-center text-[#5F6F73]">
                  No recent notifications
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-[#F9FAFB] flex justify-center">
              <Link
                href="/user-dashboard/notifications"
                onClick={onClose}
                className="text-[#0FA4A9] font-medium hover:underline"
              >
                View notification history
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
