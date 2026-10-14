"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Sparkles,
  Dumbbell,
  Clock,
  CheckCircle2,
  Trash2,
  Bell,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getNotificationUrl } from "@/lib/notificationUtils";

export type Notification = {
  id: string;
  title: string | null;
  type: string | null;
  message: string;
  created_at: string;
  created_at_formatted: string;
  read_at: string | null;
  url?: string | null;
  action_url?: string | null;
  link?: string | null;
  target_url?: string | null;
  redirect_url?: string | null;
  data?: any;
  [key: string]: any;
};

const getNotificationIcon = (type: string | null) => {
  const t = type?.toLowerCase() || "";
  if (t === "insight_msg" || t.includes("insight") || t.includes("ai"))
    return <Sparkles size={18} className="text-[#F59E0B]" />;
  if (t.includes("program") || t.includes("workout"))
    return <Dumbbell size={18} className="text-[#3A86FF]" />;
  if (t.includes("motivation") || t.includes("message"))
    return <MessageCircle size={18} className="text-[#A855F7]" />;
  if (t.includes("reminder") || t.includes("check-in"))
    return <Clock size={18} className="text-[#EF4444]" />;
  if (
    t.includes("approval") ||
    t.includes("goal") ||
    t.includes("sub") ||
    t.includes("plan")
  )
    return <CheckCircle2 size={18} className="text-[#10B981]" />;
  return <Bell size={18} className="text-[#0FA4A9]" />;
};

const getNotificationIconBg = (type: string | null) => {
  const t = type?.toLowerCase() || "";
  if (t === "insight_msg" || t.includes("insight") || t.includes("ai"))
    return "bg-[#F59E0B]/10";
  if (t.includes("program") || t.includes("workout"))
    return "bg-[#3A86FF]/10";
  if (t.includes("motivation") || t.includes("message"))
    return "bg-[#A855F7]/10";
  if (t.includes("reminder") || t.includes("check-in"))
    return "bg-[#EF4444]/10";
  if (
    t.includes("approval") ||
    t.includes("goal") ||
    t.includes("sub") ||
    t.includes("plan")
  )
    return "bg-[#10B981]/10";
  return "bg-[#0FA4A9]/10";
};

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkSingleAsRead: (id: string) => void;
  onDeleteSingleNotification: (id: string) => void;
  notifications: Notification[];
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  unreadCount?: number;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
  onMarkAllAsRead,
  onMarkSingleAsRead,
  onDeleteSingleNotification,
  notifications,
  triggerRef,
  unreadCount = 0,
}: NotificationDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (!triggerRef?.current) {
        const width = Math.min(410, screenWidth - 24);
        setPosition({
          top: 60,
          left: Math.max(12, (screenWidth - width) / 2),
          width,
        });
        return;
      }

      const rect = triggerRef.current.getBoundingClientRect();

      // Mobile devices (< 640px): span screen width with clean margins
      if (screenWidth < 640) {
        const margin = 10;
        const width = screenWidth - margin * 2;
        setPosition({
          top: Math.min(rect.bottom + 8, screenHeight - 120),
          left: margin,
          width,
        });
      } else {
        // Desktop / Tablet (>= 640px): align directly below the trigger bell, clamped to screen edges
        const dropdownWidth = Math.min(410, screenWidth - 32);
        const triggerCenter = rect.left + rect.width / 2;
        const idealLeft = triggerCenter - dropdownWidth / 2;

        const minLeft = 16;
        const maxLeft = screenWidth - dropdownWidth - 16;
        const clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));

        setPosition({
          top: rect.bottom + 8,
          left: clampedLeft,
          width: dropdownWidth,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, triggerRef, onClose]);

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.read_at) {
      onMarkSingleAsRead(notif.id);
    }

    const targetUrl = getNotificationUrl(notif, pathname);
    if (targetUrl) {
      onClose();
      if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
        window.open(targetUrl, "_blank");
      } else {
        router.push(targetUrl);
      }
    }
  };

  const notificationsHref = pathname?.includes("/trainer-dashboard")
    ? "/trainer-dashboard/notifications"
    : pathname?.includes("/nutritionist-dashboard")
    ? "/nutritionist-dashboard/notifications"
    : "/user-dashboard/notifications";

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && position && (
        <>
          {/* Backdrop for outside click detection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[998] bg-black/5"
          />

          {/* Dropdown Floating Container */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              zIndex: 999,
            }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[580px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 bg-[#F9FAFB] border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1F2D2E]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-[#0FA4A9] text-xs font-semibold hover:underline cursor-pointer transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
                  aria-label="Close notifications"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1 p-2 flex flex-col divide-y divide-gray-50 min-h-0">
              <AnimatePresence>
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03, duration: 0.18 }}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      "group flex items-start gap-3 p-3 sm:p-3.5 hover:bg-gray-50/80 rounded-xl transition-all cursor-pointer relative",
                      !notif.read_at && "bg-[#F0FDFA]/60"
                    )}
                  >
                    {/* Notification Type Icon */}
                    <div
                      className={cn(
                        "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs",
                        getNotificationIconBg(notif.type)
                      )}
                    >
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-7">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1F2D2E] truncate">
                          {notif.title || "Notification"}
                        </h4>
                        <span className="text-[10px] font-semibold text-[#5F6F73] shrink-0 whitespace-nowrap">
                          {notif.created_at_formatted}
                        </span>
                      </div>
                      <p className="text-xs text-[#5F6F73] leading-relaxed break-words line-clamp-2">
                        {notif.message}
                      </p>
                    </div>

                    {/* Delete Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSingleNotification(notif.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-80 sm:opacity-0 group-hover:opacity-100"
                      title="Delete notification"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {notifications.length === 0 && (
                <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-2.5">
                    <Bell size={20} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    No notifications yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                    You&apos;re all caught up! Updates and alerts will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2.5 sm:p-3 border-t border-gray-100 bg-[#F9FAFB] flex justify-center shrink-0">
                <Link
                  href={notificationsHref}
                  onClick={onClose}
                  className="text-[#0FA4A9] text-xs font-semibold hover:underline transition-all"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
