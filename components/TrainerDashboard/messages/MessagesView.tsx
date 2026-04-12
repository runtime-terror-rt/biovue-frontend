"use client";

import { Suspense, useState, useMemo } from "react";
import ChatArea from "./ChatArea";
import ClientsListSidebar from "./ClientListSidebar";
import { useGetConversationsQuery } from "@/redux/features/api/userDashboard/messagesApi";

export default function MessagesView() {
  const [selectedClientId, setSelectedClientId] = useState("1");
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
    <div className="flex border-t-2 pt-5 border-[#E3ECEB] gap-5">
      {/* Clients List Sidebar */}
      <Suspense
        fallback={<div className="w-20 md:w-65 border-r border-gray-200" />}
      >
        <ClientsListSidebar
          selectedClientId={selectedClientId}
          onSelectClient={setSelectedClientId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Suspense>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {selectedClient ? (
          <ChatArea
            clientId={selectedClient.id}
            clientName={selectedClient.name}
            clientAvatar={selectedClient.avatar}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a client to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
