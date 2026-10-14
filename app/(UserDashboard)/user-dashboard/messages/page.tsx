"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Search, Send, MoreVertical, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/common/Avatar";
import {
  useGetConversationsQuery,
  useGetMessagesByUserIdQuery,
  useSendMessageMutation,
  Message,
} from "@/redux/features/api/userDashboard/messagesApi";
import { useSelector } from "react-redux";
import SubscriptionGuard from "@/components/common/SubscriptionGuard";

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

  // Auto-select first contact only on desktop/wider screens
  useEffect(() => {
    if (
      contacts.length > 0 &&
      !activeContactId &&
      typeof window !== "undefined" &&
      window.innerWidth >= 768
    ) {
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
    <SubscriptionGuard>
      <div className="flex flex-col h-[calc(100dvh-57px)] sm:h-[calc(100dvh-65px)] md:h-[calc(100dvh-73px)] overflow-hidden">
        {/* Page Header */}
        <div
          className={cn(
            "px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 border-b border-gray-100 bg-white shrink-0",
            activeContactId ? "hidden md:block" : "block"
          )}
        >
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F2D2E]">Messages</h1>
          <p className="text-[#5F6F73] text-xs sm:text-sm">Communicate with your Trainer</p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden bg-[#F8FAFB]">
          {/* Sidebar (Contacts list) */}
          <div
            className={cn(
              "w-full md:w-80 lg:w-96 shrink-0 bg-white border-r border-gray-100 flex flex-col h-full",
              activeContactId ? "hidden md:flex" : "flex"
            )}
          >
            {/* Search Box */}
            <div className="p-3 sm:p-4 shrink-0">
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
                  className="w-full bg-[#F4FBFA] border-none rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#0FA4A9] outline-none placeholder:text-[#5F6F73]/60"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-50">
              {isConversationsLoading ? (
                <div className="flex flex-col justify-center items-center py-12 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  <span className="text-xs text-gray-400">Loading conversations...</span>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-3">
                    <MessageSquare size={20} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">No conversations found</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                    {searchQuery
                      ? "No contacts match your search."
                      : "You don't have any active conversations yet."}
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setActiveContactId(contact.id)}
                    className={cn(
                      "p-3.5 sm:p-4 cursor-pointer transition-colors flex items-center gap-3",
                      contact.id === activeContactId
                        ? "bg-[#E4EFFF]/60 md:border-r-2 md:border-r-teal-600"
                        : "hover:bg-gray-50",
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar
                        src={contact.avatar}
                        name={contact.name}
                        size="lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-sm font-semibold text-[#1F2D2E] truncate">
                          {contact.name}
                        </h3>
                        <span className="text-[11px] font-medium text-[#5F6F73] shrink-0 ml-2">
                          {contact.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#5F6F73] truncate leading-normal">
                        {contact.lastMessage}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              "flex-1 flex flex-col bg-white min-w-0 h-full",
              !activeContactId ? "hidden md:flex" : "flex"
            )}
          >
            {activeContact ? (
              <>
                {/* Chat Header */}
                <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-gray-100 flex items-center justify-between shadow-xs bg-white z-10 shrink-0">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <button
                      onClick={() => setActiveContactId(null)}
                      className="md:hidden p-1.5 -ml-1 text-[#5F6F73] hover:text-[#1F2D2E] rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                      aria-label="Back to contacts"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="shrink-0">
                      <Avatar
                        src={activeContact.avatar}
                        name={activeContact.name}
                        size="md"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h2 className="text-sm sm:text-base font-bold text-[#1F2D2E] truncate">
                        {activeContact.name}
                      </h2>
                      <span className="text-[11px] sm:text-xs text-[#5F6F73] truncate">
                        {activeContact.handle}
                      </span>
                    </div>
                  </div>
                  <button className="text-[#5F6F73] hover:text-[#1F2D2E] p-1.5 rounded-lg hover:bg-gray-50 transition-colors shrink-0">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Message History */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 bg-[#F8FAFB] min-h-0">
                  {isMessagesLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                    </div>
                  ) : !messagesData || messagesData.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
                        <MessageSquare size={22} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">No messages yet</p>
                      <p className="text-xs text-gray-400 mt-0.5">Send a message to start the conversation!</p>
                    </div>
                  ) : (
                    messagesData.map((msg: any) => {
                      // If sender_id matches the active contact, it's from them.
                      const isMe = msg.sender_id !== activeContact.id;

                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[70%]",
                            isMe
                              ? "self-end items-end text-right"
                              : "self-start items-start text-left",
                          )}
                        >
                          <div
                            className={cn(
                              "px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-xs mb-1 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed break-words whitespace-pre-wrap",
                              isMe
                                ? "bg-[#C7F5CB] text-[#1F2D2E] rounded-tr-none"
                                : "bg-white text-[#1F2D2E] border border-gray-100 rounded-tl-none",
                            )}
                          >
                            {msg.message}
                          </div>
                          <span className="text-[10px] font-medium text-[#5F6F73] px-1">
                            {formatMessageTime(msg.created_at)}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 sm:p-4 md:p-5 bg-[#F8FAFB] border-t border-gray-100 shrink-0">
                  <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xs p-2 sm:p-2.5 flex items-center gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent border-none outline-none text-[#1F2D2E] text-xs sm:text-sm md:text-[15px] placeholder:text-[#5F6F73]/50 px-2 min-w-0"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || isSending}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-teal-600 rounded-xl text-white hover:bg-teal-700 transition-colors disabled:opacity-50 shrink-0"
                      aria-label="Send message"
                    >
                      {isSending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} className="ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFB]">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-3 shadow-xs">
                  <MessageSquare size={30} />
                </div>
                <h3 className="text-base font-semibold text-[#1F2D2E] mb-1">
                  Select a conversation
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6F73] max-w-xs">
                  Choose a conversation from the list to start chatting with your trainer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
};

export default MessagesPage;
