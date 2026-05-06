"use client";

import { AlertTriangle, Send, Trash2, User as UserIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface Props {
  name: string;
  initialMessage: string;
  onBack: () => void;
}

export default function PreHireChatArea({
  name,
  initialMessage,
  onBack,
}: Props) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      senderRole: "client",
      text: initialMessage,
      timestamp: "Today - 8:30 AM",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        senderRole: "coach",
        text: input,
        timestamp: "Today - 8:31 AM",
      },
    ]);

    setInput("");
  };

  return (
    <div className="flex flex-col h-full border-t border-[#E5E7EB]">
      {/* Warning Banner */}
      <div className="bg-[#A0400E1A] flex items-center gap-2 text-[#A0400E] text-xs px-6 py-3 border-b border-orange-100">
        <AlertTriangle />
        <span>
          {" "}
          Pre-Hire Conversation .user has not connected yet . Keep replies
          informational and avoid medical advice.
        </span>
      </div>
      <div className="px-6 py-5 ">
        <button
          onClick={onBack}
          className="text-sm cursor-pointer text-[#0D9488] font-medium hover:underline"
        >
          ← Back to Inquiries
        </button>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between pr-6">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E5E7EB]">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E5E7EB] bg-gray-50 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="font-medium">{name}</h3>
        </div>
        <Trash2 className="cursor-pointer hover:opacity-80 text-gray-400" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        <div className="text-center  rounded-full text-xs text-gray-400">
          CONVERSATION STARTED
        </div>

        {messages.map((msg) => {
          const isCoach = msg.senderRole === "coach";
          return (
            <div
              key={msg.id}
              className={`flex ${isCoach ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-4 py-3 text-sm ${
                  isCoach ? "bg-[#22C55E59]" : "bg-white border border-[#E5E7EB]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-6 py-6 border-t border-[#E5E7EB]">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-white rounded-xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D9488] hover:bg-[#0D948814] p-2 rounded-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

