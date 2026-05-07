"use client";

import { useState } from "react";
import { X, Loader2, Send, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useGetConnectedClientsQuery } from "@/redux/features/api/TrainerDashboard/Clients/YourClients";
import { useSendMessageMutation } from "@/redux/features/api/userDashboard/messagesApi";
import Image from "next/image";

interface MotivationalMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MotivationalMessageModal({
  isOpen,
  onClose,
}: MotivationalMessageModalProps) {
  const { data: clientsData, isLoading: isClientsLoading } = useGetConnectedClientsQuery(undefined, {
    skip: !isOpen,
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [message, setMessage] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const clients = clientsData?.data || [];
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === filteredClients.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredClients.map(c => c.id));
    }
  };

  const handleSendMessages = async () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one client.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a motivational message.");
      return;
    }

    try {
      // Sending messages sequentially for now as there's no bulk API
      const sendPromises = selectedUserIds.map(id => 
        sendMessage({
          receiver_id: id,
          message: `Today's Motivation: ${message}`,
        }).unwrap()
      );

      await Promise.all(sendPromises);

      toast.success(`Motivational message sent to ${selectedUserIds.length} clients!`);
      setMessage("");
      setSelectedUserIds([]);
      onClose();
    } catch (err: any) {
      console.error("Send message error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to send messages.");
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-[#F8FBFA] flex justify-between items-center bg-[#F8FBFA]/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[#041228]">Send Motivation</h2>
            <p className="text-sm text-[#5F6F73]">Encourage your clients to stay on track</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#041228] transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Client Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[#041228]">Select Clients</label>
              <button 
                onClick={toggleSelectAll}
                className="text-xs font-semibold text-[#0FA4A9] hover:underline"
              >
                {selectedUserIds.length === filteredClients.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-[#E2E8F0] rounded-xl focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9]"
              />
            </div>

            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              {isClientsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0FA4A9]" />
                </div>
              ) : filteredClients.length > 0 ? (
                <div className="divide-y divide-[#E2E8F0]">
                  {filteredClients.map((client) => (
                    <div 
                      key={client.id}
                      onClick={() => toggleUserSelection(client.id)}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-[#F8FBFA] ${selectedUserIds.includes(client.id) ? 'bg-[#F0FDFB]' : ''}`}
                    >
                      <div className="relative shrink-0">
                        {client.image_url ? (
                          <Image
                            src={client.image_url}
                            alt={client.name}
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#E4F0FF] text-[#0FA4A9] flex items-center justify-center font-bold text-sm">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {selectedUserIds.includes(client.id) && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0FA4A9] rounded-full flex items-center justify-center text-white border-2 border-white">
                            <Check size={10} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-[#041228] truncate">{client.name}</span>
                        <span className="text-xs text-[#5F6F73] truncate">{client.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-[#5F6F73] text-sm italic">
                  No clients found.
                </div>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228]">Motivational Message</label>
            <Textarea
              placeholder="Type your encouragement here... e.g. Keep up the great work with your nutrition this week! You're making amazing progress."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-30 bg-white border-[#E2E8F0] rounded-xl p-4 text-sm focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-[#F8FBFA] shrink-0">
          <Button
            disabled={isSending || selectedUserIds.length === 0 || !message.trim()}
            onClick={handleSendMessages}
            className="w-full bg-[#0FA4A9] hover:bg-[#0D9488] text-white font-bold rounded-xl h-12 shadow-md transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send size={18} />
                Send to {selectedUserIds.length} {selectedUserIds.length === 1 ? 'Client' : 'Clients'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
