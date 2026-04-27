"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useGetConnectedClientsQuery } from "@/redux/features/api/TrainerDashboard/Clients/YourClients";
import { useGiftCreditMutation } from "@/redux/features/api/TrainerDashboard/GiftProjection";

interface GiftProjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedUserIds?: number[];
  preselectedUserNames?: string[];
}

export default function GiftProjectionModal({
  isOpen,
  onClose,
  preselectedUserIds = [],
  preselectedUserNames = [],
}: GiftProjectionModalProps) {
  const { data: clientsData, isLoading: isClientsLoading } = useGetConnectedClientsQuery(undefined, {
    skip: !isOpen,
  });

  const [giftCredit, { isLoading: isGifting }] = useGiftCreditMutation();
  const [projectionAmount, setProjectionAmount] = useState<string>("1");

  useEffect(() => {
    if (isOpen) {
      setProjectionAmount("1");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const clients = clientsData?.data || [];
  // Find full client info from query to get the email
  const isBulk = preselectedUserIds.length > 1;
  const singleUserId = preselectedUserIds.length === 1 ? preselectedUserIds[0] : null;
  const selectedClient = singleUserId ? clients.find((c) => c.id === singleUserId) : null;

  const handleGiftProjections = async () => {
    const amount = Number(projectionAmount);
    if (!preselectedUserIds || preselectedUserIds.length === 0) {
      toast.error("No users selected.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid projection amount (greater than 0).");
      return;
    }

    try {
      await giftCredit({
        receiver_ids: preselectedUserIds,
        amount,
      }).unwrap();

      toast.success("Projection gifted successfully!");
      onClose();
    } catch (err: any) {
      console.error("Gift projection error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to gift projection.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-[#F8FBFA] flex justify-between items-center bg-[#F8FBFA]/50">
          <h2 className="text-xl font-bold text-[#041228]">Gift Projection</h2>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#041228] transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Selected User Info */}
          <div className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-xl p-4 flex flex-col">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
              Gifting To
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E4F0FF] text-[#0FA4A9] flex items-center justify-center font-bold text-lg shrink-0">
                {isBulk ? preselectedUserIds.length : (selectedClient?.name || preselectedUserNames[0] || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-base font-bold text-[#041228] truncate">
                  {isBulk ? `${preselectedUserIds.length} Selected Users` : (selectedClient?.name || preselectedUserNames[0] || "Unknown User")}
                </div>
                {!isBulk && (
                  isClientsLoading ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <Loader2 className="w-3 h-3 animate-spin text-[#0FA4A9]" />
                      <span className="text-xs text-[#94A3B8]">Loading email...</span>
                    </div>
                  ) : (
                    <div className="text-sm text-[#5F6F73] truncate">
                      {selectedClient?.email || "Email not available"}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228]">Projection Amount</label>
            <Input
              type="number"
              min="1"
              value={projectionAmount}
              onChange={(e) => setProjectionAmount(e.target.value)}
              className="w-full bg-white border border-[#D9E6FF] rounded-xl px-4 py-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all"
              placeholder="e.g. 5"
            />
          </div>

          <Button
            disabled={isGifting}
            onClick={handleGiftProjections}
            className="w-full bg-[#0FA4A9] hover:bg-[#0D9488] text-white font-bold rounded-xl h-12 shadow-md transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isGifting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Confirm Gift"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
