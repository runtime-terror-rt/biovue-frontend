"use client";

import { useGetConversationsQuery, Message } from "@/redux/features/api/userDashboard/messagesApi";
import { Loader2, Quote, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { cn, getFullImageUrl } from "@/lib/utils";
import Avatar from "@/components/common/Avatar";

export default function TrainerMotivation() {
  const { data: conversationsData, isLoading } = useGetConversationsQuery();

  const motivationalMessages = useMemo(() => {
    if (!conversationsData) return [];

    const allMessages: Message[] = Object.values(conversationsData).flat();
    
    return allMessages
      .filter(msg => msg.message.startsWith("[MOTIVATION]"))
      .map(msg => ({
        ...msg,
        cleanMessage: msg.message.replace("[MOTIVATION] ", "").replace("[MOTIVATION]", "")
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [conversationsData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center min-h-[140px]">
        <Loader2 className="w-6 h-6 animate-spin text-[#0FA4A9]" />
      </div>
    );
  }

  if (motivationalMessages.length === 0) {
    return null; // Don't show anything if no motivational messages
  }

  const latestMessage = motivationalMessages[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0FA4A9]/5 to-[#3A86FF]/5 border border-[#0FA4A9]/20 rounded-2xl p-6 shadow-sm">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Quote size={80} className="text-[#0FA4A9]" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#0FA4A9] rounded-lg text-white">
            <Sparkles size={18} />
          </div>
          <div className="flex items-center gap-2">
            <Avatar 
              src={latestMessage.sender.image_url || latestMessage.sender.profile_image || latestMessage.sender.profile?.image} 
              name={latestMessage.sender.name} 
              size="sm" 
              border={false}
              className="w-6 h-6"
            />
            <h3 className="text-sm font-bold text-[#1F2D2E] uppercase tracking-wider">
              Motivation from {latestMessage.sender.name}
            </h3>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg md:text-xl font-medium text-[#1F2D2E] leading-relaxed italic">
            "{latestMessage.cleanMessage}"
          </p>
          <p className="text-xs text-[#5F6F73] font-medium">
            Received on {new Date(latestMessage.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
