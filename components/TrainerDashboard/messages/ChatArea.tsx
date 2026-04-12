"use client";

import { useState, useRef, useEffect } from "react";
import { Send} from "lucide-react";

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
    // <div className="flex flex-col h-full  border-l border-[#E5E7EB]">
    //   {/* Chat Header */}
    //   <div className="flex items-center justify-between px-6 py-4  border-b border-[#E5E7EB]">
    //     <div className="flex items-center gap-3">
    //       <div className="relative w-10 h-10">
    //         <Image
    //           src={clientAvatar || "/images/user.png"}
    //           alt={clientName}
    //           fill
    //           className="rounded-full object-cover border border-[#E5E7EB]"
    //         />
    //       </div>
    //       <div>
    //         <h3 className="text-sm font-semibold text-[#111827]">{clientName}</h3>
    //         <p className="text-xs text-[#6B7280]">{clientName}</p>
    //       </div>
    //     </div>
    //     <div className="flex items-center gap-4">
    //       <button className="text-[#0FA4A9] text-sm cursor-pointer font-medium hover:underline flex items-center gap-1">
    //         View client profile
    //       </button>

    //     </div>
    //   </div>

    //   {/* Messages Area */}
    //   <div className="flex-1 overflow-y-auto px-6 py-8">
    //     <div className="flex flex-col gap-8">
    //       {messages.map((msg) => {
    //         const isCoach = msg.senderRole === "coach";
    //         return (
    //           <div
    //             key={msg.id}
    //             className={`flex flex-col ${isCoach ? "items-end" : "items-start"}`}
    //           >
    //             <div
    //               className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
    //                 isCoach
    //                   ? "bg-[#22C55E59] text-[#111827] rounded-tr-none"
    //                   : "bg-white border border-[#E5E7EB] text-[#374151] rounded-tl-none shadow-sm"
    //               }`}
    //             >
    //               {msg.text}
    //             </div>
    //             <span className="text-[10px] text-[#9CA3AF] mt-2 px-1">
    //               {msg.timestamp}
    //             </span>
    //           </div>
    //         );
    //       })}
    //       <div ref={scrollRef} />
    //     </div>
    //   </div>

    //   {/* Input Area */}
    //   <div className="px-6 py-6  border-t border-[#E5E7EB]">
    //     <div className="relative group">
    //       <input
    //         placeholder="Type your message..."
    //         className="w-full bg-white rounded-xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] transition-all placeholder:text-[#9CA3AF]"
    //         value={inputValue}
    //         onChange={(e) => setInputValue(e.target.value)}
    //         onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
    //       />
    //       <button
    //         onClick={handleSendMessage}
    //         disabled={!inputValue.trim()}
    //         className="absolute right-4 top-1/2 -translate-y-1/2 p-2 cursor-pointer text-[#0D9488] hover:bg-[#0D948814] rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    //       >
    //         <Send className="w-6 h-6 rotate-[-10deg]" />
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col h-full border-l border-[#E5E7EB]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src={clientAvatar || "/images/user.png"}
              alt={clientName}
              fill
              className="rounded-full object-cover border border-[#E5E7EB]"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#111827]">
              {clientName}
            </h3>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="flex flex-col gap-4">
          {isMessagesLoading ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : messagesData && messagesData.length > 0 ? (
            messagesData.map((msg: Message) => {
              const isCoach = msg.sender_id !== Number(clientId);
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCoach ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      isCoach
                        ? "bg-[#22C55E59] text-[#111827] rounded-tr-none"
                        : "bg-white border border-[#E5E7EB] text-[#374151] rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-400">No messages yet</p>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 py-6 border-t border-[#E5E7EB]">
        <div className="relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="w-full bg-white rounded-xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D9488] transition-all placeholder:text-[#9CA3AF]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D9488] hover:bg-[#0D948814] p-2 rounded-lg transition-all disabled:opacity-40"
          >
            <Send className="w-6 h-6 rotate-[-10deg]" />
          </button>
        </div>
      </div>
    </div>
  );
}
