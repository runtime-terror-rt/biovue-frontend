"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Search, Send, MoreVertical, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/common/Avatar";
import {
  useGetConversationsQuery,
  useGetMessagesByUserIdQuery,
  useSendMessageMutation,
  Message,
} from "@/redux/features/api/userDashboard/messagesApi";
import { useSelector } from "react-redux";

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeString = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today - ${timeString}`;
  if (isYesterday) return `Yesterday - ${timeString}`;

  const dateStr = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${dateStr} - ${timeString}`;
};

const MessagesPage = () => {
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversationsData, isLoading: isConversationsLoading } =
    useGetConversationsQuery();
  const { data: messagesData, isLoading: isMessagesLoading } =
    useGetMessagesByUserIdQuery(activeContactId as number, {
      skip: !activeContactId,
    });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const authUser = useSelector((state: any) => state.auth.user); // Assuming user is in auth state
  // Or if auth state isn't easily accessible, derive it from the sender/receiver id logic

  // 1. Process Conversations Map into an array of Contacts
  const contacts = useMemo(() => {
    if (!conversationsData) return [];

    // The API returns a map where the key is the other user's ID
    const contactList = Object.entries(conversationsData).map(
      ([otherUserId, messages]) => {
        // Find the last message to get contact details and preview
        const lastMessage = messages[messages.length - 1];

        // Determine which user is the "other" contact
        const isSender = lastMessage.sender_id.toString() === otherUserId;
        const contactUser = isSender
          ? lastMessage.sender
          : lastMessage.receiver;
        const myId = isSender ? lastMessage.receiver_id : lastMessage.sender_id;

        return {
          id: contactUser.id,
          name: contactUser.name,
          handle: contactUser.email,
          avatar:
            contactUser.image_url ||
            `https://ui-avatars.com/api/?name=${contactUser.name}`,
          lastMessage: lastMessage.message,
          time: new Date(lastMessage.updated_at).toLocaleDateString([], {
            month: "short",
            day: "numeric",
          }),
          isActive: false, // Could add real logic if needed
          myId, // Keep track of the logged-in user's ID
        };
      },
    );

    return contactList.sort((a, b) => b.id - a.id); // Simple sort if needed, maybe by date in real app
  }, [conversationsData]);

  // Set initial active contact
  useEffect(() => {
    if (contacts.length > 0 && !activeContactId) {
      setActiveContactId(contacts[0].id);
    }
  }, [contacts, activeContactId]);

  const activeContact = contacts.find((c) => c.id === activeContactId);
  const currentUserId = activeContact?.myId;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  // Search Filter
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeContactId) return;

    try {
      await sendMessage({
        receiver_id: activeContactId,
        message: messageText,
      }).unwrap();

      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Page Header */}
      <div className="px-8 py-6">
        <h1 className="text-2xl font-bold text-[#1F2D2E]">Messages</h1>
        <p className="text-[#5F6F73] text-sm">Communicate with your Trainer</p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden bg-[#F8FAFB] border-t border-gray-100">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
          {/* Search Box */}
          <div className="p-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6F73]"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Contacts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F4FBFA] border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#0FA4A9] outline-none placeholder:text-[#5F6F73]/60"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {isConversationsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No conversations found.
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setActiveContactId(contact.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-all flex items-start gap-3 border-b border-gray-50",
                    contact.id === activeContactId
                      ? "bg-[#E4EFFF]/50"
                      : "hover:bg-gray-50",
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar
                      src={contact.avatar}
                      name={contact.name}
                      size="lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-bold text-[#1F2D2E] truncate">
                        {contact.name}
                      </h3>
                      <span className="text-[10px] font-medium text-[#5F6F73] whitespace-nowrap">
                        {contact.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#5F6F73] truncate leading-tight">
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={activeContact.avatar}
                    name={activeContact.name}
                    size="md"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-sm font-bold text-[#1F2D2E]">
                      {activeContact.name}
                    </h2>
                    <span className="text-xs text-[#5F6F73]">
                      {activeContact.handle}
                    </span>
                  </div>
                </div>
                <button className="text-[#5F6F73] hover:text-[#1F2D2E] transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#F8FAFB]">
                {isMessagesLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                  </div>
                ) : !messagesData || messagesData.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                    Start a conversation!
                  </div>
                ) : (
                  messagesData.map((msg) => {
                    // If sender_id matches the active contact, it's from them.
                    const isMe = msg.sender_id !== activeContact.id;

                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex flex-col max-w-[70%]",
                          isMe
                            ? "self-end items-end text-right"
                            : "self-start items-start text-left",
                        )}
                      >
                        <div
                          className={cn(
                            "px-5 py-3 rounded-2xl shadow-sm mb-1.5 text-[15px] leading-relaxed",
                            isMe
                              ? "bg-[#C7F5CB] text-[#1F2D2E] rounded-tr-none"
                              : "bg-white text-[#1F2D2E] border border-gray-100 rounded-tl-none",
                          )}
                        >
                          {msg.message}
                        </div>
                        <span className="text-[10px] font-medium text-[#5F6F73]">
                          {formatMessageTime(msg.created_at)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 bg-[#F8FAFB] border-t border-gray-50">
                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-3 flex items-center gap-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none outline-none text-[#1F2D2E] text-[15px] placeholder:text-[#5F6F73]/50 ml-2"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSending}
                    className="w-10 h-10 flex items-center justify-center bg-teal-600 rounded-xl text-white hover:bg-teal-700 transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    {isSending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} className="ml-1" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#F8FAFB]">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
