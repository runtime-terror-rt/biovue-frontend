"use client";

import { Suspense, useState, useMemo } from "react";
import ChatArea from "./ChatArea";
import ClientsListSidebar from "./ClientListSidebar";
import { useGetConversationsQuery } from "@/redux/features/api/userDashboard/messagesApi";

export default function MessagesView() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversationsData } = useGetConversationsQuery();

  const selectedClient = useMemo(() => {
    if (!conversationsData || !selectedClientId) return null;
    
    // Find the conversation thread for this ID
    const thread = conversationsData[selectedClientId];
    if (!thread || thread.length === 0) return null;

    const lastMessage = thread[thread.length - 1];
    // The client is the other person in the conversation
    const contactUser = 
      lastMessage.sender_id.toString() === selectedClientId 
        ? lastMessage.sender 
        : lastMessage.receiver;

    return {
      id: contactUser.id.toString(),
      name: contactUser.name,
      avatar: contactUser.image_url || "/images/user.png"
    };
  }, [conversationsData, selectedClientId]);

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 antialiased">
      {/* Clients List Sidebar */}
      <div className="w-80 flex flex-col h-full">
        <Suspense
          fallback={<div className="w-full h-full bg-white rounded-3xl animate-pulse" />}
        >
          <ClientsListSidebar
            selectedClientId={selectedClientId}
            onSelectClient={setSelectedClientId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Suspense>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedClientId && selectedClient ? (
          <ChatArea
            clientId={selectedClient.id}
            clientName={selectedClient.name}
            clientAvatar={selectedClient.avatar}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[40px] border border-[#D9E6FF] shadow-xs text-[#94A3B8]">
            <div className="w-20 h-20 rounded-full bg-[#F8FBFA] flex items-center justify-center mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-lg font-medium">Select a client to start messaging</p>
            <p className="text-sm mt-1">Stay connected with your clients through BioVue Chat</p>
          </div>
        )}
      </div>
    </div>
  );
}
