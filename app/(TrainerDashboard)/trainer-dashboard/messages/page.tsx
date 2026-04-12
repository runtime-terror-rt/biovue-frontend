"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Send } from "lucide-react";

import ChatArea from "@/components/TrainerDashboard/messages/ChatArea";
import ClientsListSidebar from "@/components/TrainerDashboard/messages/ClientListSidebar";
import MotivationModal from "@/components/TrainerDashboard/messages/MotivationModal";
import PreHireInquiries from "@/components/TrainerDashboard/messages/PreHireInqueries";
import { mockPreHireUsers } from "@/components/TrainerDashboard/messages/MessageData";
import PreHireChatArea from "@/components/TrainerDashboard/messages/PreHireChatArea";
import { useGetConnectedClientsQuery } from "@/redux/features/api/TrainerDashboard/Clients/YourClients";

export default function MessagesPage() {
  const { data: connectedClientsData } = useGetConnectedClientsQuery();
  const clients = connectedClientsData?.data || [];

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMotivation, setOpenMotivation] = useState(false);

  useEffect(() => {
    if (clients.length > 0 && !selectedClientId) {
      setSelectedClientId(clients[0].id.toString());
    }
  }, [clients, selectedClientId]);

  const selectedClient = clients.find((c) => c.id.toString() === selectedClientId);

  const [selectedPreHireId, setSelectedPreHireId] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"active" | "prehire">("active");
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-medium text-[#111827]">Messages</h1>
            <span className="bg-[#0D9488] text-white text-xs font-medium px-3 py-1 rounded-full">
              {viewMode === "active" ? "Active Clients" : "Pre-Hire Inquiries"}
            </span>
          </div>
          <p className="text-sm text-[#6B7280]">
            Communicate with your clients and support their progress.
          </p>
        </div>
        <div className="relative flex items-center gap-3">
          {viewMode === "active" && (
            <button
              onClick={() => selectedClient && setOpenMotivation(true)}
              className="bg-[#0D9488] flex items-center cursor-pointer rounded-lg px-4 py-2.5 hover:opacity-90 transition-opacity text-white gap-2 font-medium"
            >
              <Send className="w-5 h-5 rotate-[-10deg]" />
              <span>Send Motivation</span>
            </button>
          )}

          {/* More Vertical */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="p-2 cursor-pointer rounded-lg hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-lg py-2 z-50">
                <button
                  onClick={() => {
                    setViewMode("active");
                    setOpenMenu(false);
                  }}
                  className={`w-full cursor-pointer text-left px-4 py-2 text-sm hover:bg-gray-50  ${viewMode === "active" ? "bg-[#f5f5f5]" : "hover:bg-gray-50"}`}
                >
                  Active Clients
                </button>
                <button
                  onClick={() => {
                    setViewMode("prehire");
                    setOpenMenu(false);
                  }}
                  className={`w-full cursor-pointer text-left px-4 py-2 text-sm hover:bg-gray-50  ${viewMode === "prehire" ? "bg-[#f5f5f5]" : "hover:bg-gray-50"}`}
                >
                  Pre-Hire Inquiries
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 gap-0 border-t border-[#E5E7EB] -mx-6 px-6 pt-0 overflow-hidden">
        {viewMode === "active" && (
          <div className="flex flex-1 gap-0 border-t border-[#E5E7EB] -mx-6 px-6 pt-0 overflow-hidden">
            {/* Sidebar */}
            <div className="w-[320px] border-r border-[#E5E7EB] pt-6 pr-4 h-full">
              <ClientsListSidebar
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Chat */}
            <div className="flex flex-col flex-1 h-full">
              {selectedClient ? (
                <ChatArea
                  clientId={selectedClient.id.toString()}
                  clientName={selectedClient.name}
                  clientAvatar={selectedClient.image_url || undefined}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a client to view chat
                </div>
              )}
            </div>
          </div>
        )}
        {viewMode === "prehire" && (
          <div className="flex flex-1 w-full">
            {selectedPreHireId ? (
              <PreHireChatArea
                name={
                  mockPreHireUsers.find((u) => u.id === selectedPreHireId)
                    ?.name || ""
                }
                initialMessage={
                  mockPreHireUsers.find((u) => u.id === selectedPreHireId)
                    ?.message || ""
                }
                onBack={() => setSelectedPreHireId(null)}
              />
            ) : (
              <PreHireInquiries
                users={mockPreHireUsers}
                onSelect={(id) => setSelectedPreHireId(id)}
              />
            )}
          </div>
        )}
      </div>
      {selectedClient && (
        <MotivationModal
          open={openMotivation}
          onClose={() => setOpenMotivation(false)}
          clientName={selectedClient.name}
          onSend={(message) => {
            console.log("Send to:", selectedClient.name, message);
          }}
        />
      )}
    </div>
  );
}
