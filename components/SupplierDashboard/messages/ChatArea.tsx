"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Message,
  useGetMessagesByUserIdQuery,
  useSendMessageMutation,
} from "@/redux/features/api/userDashboard/messagesApi";

interface ChatAreaProps {
  clientId: string;
  clientName: string;
  clientAvatar?: string;
}

export default function ChatArea({
  clientId,
  clientName,
  clientAvatar,
}: ChatAreaProps) {
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    refetch,
  } = useGetMessagesByUserIdQuery(Number(clientId), {
    skip: !clientId,
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll on messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    try {
      await sendMessage({
        receiver_id: Number(clientId),
        message: inputValue,
      }).unwrap();
      setInputValue("");
      refetch(); // refresh messages
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#E4EFFF] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#F8FBFA]">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <Image
              src={clientAvatar || "/images/user.png"}
              alt={clientName}
              fill
              className="rounded-xl object-cover border border-[#E4EFFF]"
            />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#041228]">
              {clientName}
            </h3>
            <p className="text-xs text-[#94A3B8]">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
        <div className="flex flex-col gap-6">
          {isMessagesLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#0FA4A9] animate-spin" />
            </div>
          ) : messagesData && messagesData.length > 0 ? (
            messagesData.map((msg: Message) => {
              const isSupplier = msg.sender_id !== Number(clientId);
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSupplier ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-xs ${
                      isSupplier
                        ? "bg-[#E4F0FF] text-[#041228] rounded-tr-none"
                        : "bg-[#F8FBFA] border border-[#E4EFFF] text-[#5F6F73] rounded-tl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-[#94A3B8] mt-2 font-medium">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8]">
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-8 py-6 border-t border-[#F8FBFA]">
        <div className="relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="w-full bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl pl-6 pr-16 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all placeholder:text-[#94A3B8]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0FA4A9] hover:bg-[#0D9488] text-white p-2.5 rounded-xl transition-all disabled:opacity-40 shadow-sm"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
