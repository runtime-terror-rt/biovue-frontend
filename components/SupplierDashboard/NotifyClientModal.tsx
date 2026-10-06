"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Bell,
  Mail,
  MessageSquare,
  Send,
  Loader2,
  User as UserIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/redux/features/api/SupplierDashboard/AllUsers";
import { useNotifyClientMutation } from "@/redux/features/api/SupplierDashboard/NotifyClient";
import { toast } from "sonner";

interface NotifyClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const getSafeImageSrc = (src: string | null | undefined) => {
  if (!src) return null;
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    try {
      if (src.startsWith("http")) {
        new URL(src);
      }
      return src;
    } catch {
      return null;
    }
  }
  return null;
};

export default function NotifyClientModal({
  isOpen,
  onClose,
  user,
}: NotifyClientModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [notifyClient, { isLoading }] = useNotifyClientMutation();

  useEffect(() => {
    if (user && isOpen) {
      setSubject("Exclusive Supplement Recommendations for You");
      setMessage(
        `Hi ${user.name}, we have reviewed your fitness goals and prepared tailored supplements for you.`
      );
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      const response = await notifyClient({
        user_id: user.id,
        subject: subject.trim(),
        message: message.trim(),
      }).unwrap();

      toast.success(
        response?.message || `Notification email sent to ${user.email}.`
      );
      onClose();
    } catch (err: any) {
      console.error("Failed to notify client:", err);
      toast.error(
        err?.data?.message || err?.message || "Failed to send notification to client."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-[36px] shadow-2xl border border-[#D9E6FF] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-[#0FA4A9] via-[#0D9488] to-[#041228] text-white">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-6 top-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Bell size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Notify Client
              </h2>
              <p className="text-white/80 text-xs sm:text-sm font-medium">
                Send personalized supplement updates & alerts via email
              </p>
            </div>
          </div>

          {/* Client summary pill */}
          <div className="mt-5 p-3.5 bg-white/10 border border-white/15 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <div className="w-11 h-11 rounded-xl bg-white/20 overflow-hidden flex items-center justify-center shrink-0 border border-white/30">
              {getSafeImageSrc(user.profile_image) ? (
                <Image
                  src={getSafeImageSrc(user.profile_image)!}
                  alt={user.name}
                  width={44}
                  height={44}
                  className="object-cover w-full h-full"
                />
              ) : (
                <UserIcon size={20} className="text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white truncate">
                  {user.name}
                </span>
                {/* <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white uppercase tracking-wider shrink-0">
                  ID #{user.id}
                </span> */}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/80 truncate mt-0.5">
                <Mail size={12} className="shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="p-6 sm:p-8 flex flex-col gap-5 overflow-y-auto">
          {/* Quick templates */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} className="text-[#0FA4A9]" /> Templates:
            </span>
            <button
              type="button"
              onClick={() => {
                setSubject("Exclusive Supplement Recommendations for You");
                setMessage(
                  `Hi ${user.name}, we have reviewed your fitness goals and prepared tailored supplements for you.`
                );
              }}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0FA4A9]/10 text-[#0FA4A9] hover:bg-[#0FA4A9]/20 transition-colors cursor-pointer"
            >
              Supplement Recommendations
            </button>
            <button
              type="button"
              onClick={() => {
                setSubject("Special Offer on Tailored Supplements");
                setMessage(
                  `Hi ${user.name}, we have an exclusive offer on products matching your current training routine!`
                );
              }}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#3A86FF] hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Special Offer
            </button>
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#041228] flex items-center gap-1.5">
              <Mail size={14} className="text-[#0FA4A9]" />
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl text-sm font-medium text-[#041228] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all disabled:opacity-50"
              required
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#041228] flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#0FA4A9]" />
                Message Content
              </label>
              <span className="text-[11px] font-semibold text-[#94A3B8]">
                {message.length} chars
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message to the client..."
              rows={5}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl text-sm font-medium text-[#041228] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all resize-none disabled:opacity-50"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-[#D9E6FF] text-[#5F6F73] hover:text-[#041228] hover:bg-gray-50 rounded-2xl px-6 py-2.5 h-auto text-sm font-bold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !subject.trim() || !message.trim()}
              className="bg-[#0FA4A9] hover:bg-[#0D9488] text-white rounded-2xl px-7 py-2.5 h-auto text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#0FA4A9]/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Notification
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
