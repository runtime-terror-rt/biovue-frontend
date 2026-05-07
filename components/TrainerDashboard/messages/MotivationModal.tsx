"use client";

import { X, Send, Sparkles, Loader2, Check, Search, User, Quote } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useGetConnectedClientsQuery } from "@/redux/features/api/TrainerDashboard/Clients/YourClients";
import { useSendMessageMutation } from "@/redux/features/api/userDashboard/messagesApi";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface MotivationModalProps {
  open: boolean;
  onClose: () => void;
  initialSelectedClientId?: string | null;
}

const presets = [
  "Great progress this week - keep going!",
  "Consistency matters more than perfection.",
  "Small daily actions lead to big results.",
];

export default function MotivationModal({
  open,
  onClose,
  initialSelectedClientId,
}: MotivationModalProps) {
  const { data: connectedClientsData, isLoading: isClientsLoading } =
    useGetConnectedClientsQuery(undefined, { skip: !open });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [message, setMessage] = useState(presets[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const clients = connectedClientsData?.data || [];
  
  const filteredClients = useMemo(() => {
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  // Reset or set initial selection when modal opens
  useEffect(() => {
    if (open) {
      if (initialSelectedClientId) {
        setSelectedUserIds([initialSelectedClientId]);
      } else {
        setSelectedUserIds([]);
      }
      setMessage(presets[0]);
      setSearchQuery("");
    }
  }, [open, initialSelectedClientId]);

  if (!open) return null;

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSend = async () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one client");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const sendPromises = selectedUserIds.map((id) =>
        sendMessage({
          receiver_id: Number(id),
          message: `Today's Motivation: ${message}`,
        }).unwrap(),
      );

      await Promise.all(sendPromises);
      toast.success(`Motivation sent to ${selectedUserIds.length} client(s)`);
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send motivation");
    }
  };

  const getButtonText = () => {
    if (selectedUserIds.length === 0) return "Send Motivation";
    if (selectedUserIds.length === 1) {
      const client = clients.find((c) => c.id.toString() === selectedUserIds[0]);
      return `Send To ${client?.name || "Client"}`;
    }
    return `Send To ${selectedUserIds.length} Clients`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl p-0 relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[70vh]">
        {/* Header Section */}
        <div className="p-8 pb-6 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="bg-[#E6F6F4] text-[#0D9488] p-4 rounded-3xl shrink-0">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1F2D2E] mb-1">
                Send Motivation
              </h2>
              <p className="text-[#5F6F73] text-[15px]">
                Quickly inspire your active clients
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="px-8 pb-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
          {/* Client Selection Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#9AAEB2] uppercase tracking-[0.15em]">
                SELECT CLIENTS ({selectedUserIds.length})
              </label>
              {selectedUserIds.length > 0 && (
                <button 
                  onClick={() => setSelectedUserIds([])}
                  className="text-xs font-bold text-[#0D9488] hover:underline"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* Selected Clients Badges */}
            {selectedUserIds.length > 0 && (
              <div className="flex flex-wrap gap-2 py-2 max-h-24 overflow-y-auto">
                {selectedUserIds.map((id) => {
                  const client = clients.find((c) => c.id.toString() === id);
                  return (
                    <Badge
                      key={id}
                      className="bg-[#F0F9F8] text-[#0D9488] border border-[#0D948820] hover:bg-[#E6F6F4] px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all"
                    >
                      <span className="text-xs font-bold">{client?.name}</span>
                      <X
                        className="w-3.5 h-3.5 cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => toggleUserSelection(id)}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AAEB2] group-focus-within:text-[#0D9488] transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFB] border-none rounded-2xl py-4 pl-12 pr-4 text-[15px] focus:ring-2 focus:ring-[#0D948820] outline-none placeholder:text-[#9AAEB2] transition-all"
              />
            </div>

            {/* Clients List */}
            <div className="border border-gray-100 rounded-3xl overflow-hidden bg-[#F8FAFB]/50">
              <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                {isClientsLoading ? (
                  <div className="p-8 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
                  </div>
                ) : filteredClients.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {filteredClients.map((client) => {
                      const isSelected = selectedUserIds.includes(client.id.toString());
                      return (
                        <div
                          key={client.id}
                          onClick={() => toggleUserSelection(client.id.toString())}
                          className={`flex items-center gap-4 p-4 cursor-pointer transition-all hover:bg-white ${isSelected ? 'bg-white' : ''}`}
                        >
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#0D9488] border-[#0D9488]' : 'border-gray-200'}`}>
                            {isSelected && <Check size={14} className="text-white" />}
                          </div>
                          
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                            {client.image_url ? (
                              <Image src={client.image_url} alt={client.name} width={40} height={40} className="object-cover" />
                            ) : (
                              <User className="text-gray-400" size={20} />
                            )}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className={`text-[15px] font-bold truncate ${isSelected ? 'text-[#0D9488]' : 'text-[#1F2D2E]'}`}>
                              {client.name}
                            </span>
                            <span className="text-xs text-[#9AAEB2] truncate">{client.email}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#9AAEB2] text-sm font-medium">
                    No clients found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Presets Section */}
          <div className="space-y-4">
            <label className="text-xs font-black text-[#9AAEB2] uppercase tracking-[0.15em]">
              SELECT A PRESET
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setMessage(preset)}
                  className={`text-left px-5 py-4 rounded-2xl border-2 text-sm font-bold transition-all h-full flex items-center leading-snug ${
                    message === preset
                      ? "border-[#0D9488] bg-[#F0F9F8] text-[#1F2D2E]"
                      : "border-gray-50 bg-[#F8FAFB] hover:bg-gray-100 text-[#5F6F73]"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Section */}
          <div className="space-y-4">
            <label className="text-xs font-black text-[#9AAEB2] uppercase tracking-[0.15em]">
              CUSTOMIZE MESSAGE
            </label>
            <div className="relative bg-[#F8FAFB] rounded-[32px] p-6 focus-within:ring-2 focus-within:ring-[#0D948820] transition-all">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your own motivation..."
                className="w-full bg-transparent border-none p-0 text-lg font-medium text-[#1F2D2E] min-h-[140px] focus:ring-0 outline-none resize-none placeholder:text-[#9AAEB2] leading-relaxed"
              />
              <div className="absolute bottom-6 right-6 p-2 bg-white rounded-xl text-[#9AAEB2]">
                <Quote size={20} className="rotate-180" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-8 bg-gray-50 rounded-b-[40px] flex justify-between items-center gap-4">
          <button
            onClick={onClose}
            className="px-10 py-4.5 cursor-pointer rounded-2xl font-bold text-[#5F6F73] hover:text-[#1F2D2E] transition-colors text-base"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={isSending || selectedUserIds.length === 0 || !message.trim()}
            className="flex-1 max-w-[300px] cursor-pointer flex items-center justify-center gap-3 bg-[#0D9488] text-white py-4.5 rounded-[22px] hover:bg-[#0A7A6F] transition-all disabled:opacity-50 disabled:grayscale shadow-xl shadow-[#0D948820]"
          >
            {isSending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 rotate-[-10deg]" />
                <span className="font-extrabold text-base tracking-wide uppercase">
                  {getButtonText()}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
