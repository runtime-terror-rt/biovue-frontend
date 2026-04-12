"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useUpdateScheduleMutation } from "@/redux/features/api/TrainerDashboard/Calendar/CreateSchedule";
import { toast } from "sonner";
import { useState } from "react";

interface EventData {
  id: number; // ✅ MUST
  client_id: number; // ✅ MUST
  title: string;
  name: string;
  time: string;
  status: "missed" | "scheduled" | "completed";
  avatar?: string;
  date?: string;
  privateNote?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: EventData | null;
  onConfirm: () => void;
}

export default function RescheduleEventModal({
  isOpen,
  onClose,
  event,
  onConfirm,
}: Props) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [updateSchedule, { isLoading }] = useUpdateScheduleMutation();

  const handleConfirm = async () => {
    if (!newDate || !newTime || !event) return;
    
    try {
      await updateSchedule({
        id: event.id,
        client_id: event.client_id,
        date: newDate,
        time: newTime,
        check_in_type: event.title || "Message",
        private_note: event.privateNote || "",
        status: "scheduled", // ✅ reset to scheduled
      }).unwrap();

      onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-100 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
            Reschedule Event
          </h2>
          <p className="text-sm text-[#475569] mb-8 font-medium">
            Choose a new time for this session.
          </p>

          {/* User Card */}
          <div className="flex items-center justify-between border border-[#F1F5F9] rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                {event.avatar ? (
                  <Image
                    src={event.avatar}
                    alt={event.name}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0FA4A9] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {event.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-[#1E293B]">{event.name}</h4>
                <p className="text-xs text-[#94A3B8] font-medium">{event.title || "Check-in"}</p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                event.status === "missed"
                  ? "bg-[#FEE2E2] text-[#EF4444]"
                  : event.status === "scheduled"
                    ? "bg-[#F3E8FF] text-[#A855F7]"
                    : "bg-[#DCFCE7] text-[#22C55E]"
              }`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-3">
                New Date
              </label>
              <div className="relative group">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#F6EFE9] border border-[#EAC9B5] text-[#BC7F61] px-5 py-4 rounded-xl text-sm font-bold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-3">
                New Time
              </label>
              <div className="relative group">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-[#F6EFE9] border border-[#EAC9B5] text-[#BC7F61] px-5 py-4 rounded-xl text-sm font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={onClose}
              className="py-4 rounded-xl border border-[#F1F5F9] text-[#94A3B8] font-bold text-[15px] hover:bg-gray-50 transition-colors uppercase tracking-widest cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="py-4 rounded-xl bg-[#0D9488] text-white font-bold text-[15px] hover:opacity-90 transition-all shadow-lg active:scale-[0.98] uppercase tracking-widest cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
