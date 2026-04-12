"use client";

import { X, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { useUpdateScheduleMutation } from "@/redux/features/api/TrainerDashboard/Calendar/CreateSchedule";
import { toast } from "sonner";
import { useEffect, useState } from "react";
interface EventData {
  id: number;
  client_id: number;
  title: string;
  name: string;
  time: string;
  status: "missed" | "scheduled" | "completed";
  avatar?: string;
  date?: string;
  type?: string;
  privateNote?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: EventData | null;
  onSendReminder: () => void;
  onReschedule: () => void;
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  event,
  onSendReminder,
  onReschedule,
}: Props) {
  const [status, setStatus] = useState<"missed" | "completed">("missed");
  const [updateSchedule, { isLoading }] = useUpdateScheduleMutation();

  useEffect(() => {
    if (event?.status) {
      setStatus(event.status === "scheduled" ? "missed" : (event.status as "missed" | "completed"));
    }
  }, [event]);

  if (!isOpen || !event) return null;

  // Format date for display
  const displayDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";
  const handleSaveStatus = async () => {
    try {
      await updateSchedule({
        id: event.id,
        client_id: event.client_id,
        date: event.date || "",
        time: event.time,
        check_in_type: event.title,
        private_note: event.privateNote || "",
        status: status,
      }).unwrap();

      toast.success("Status updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-100 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-[#1E293B] mb-6">
            Event Details
          </h2>

          {/* User Card */}
          <div className="flex items-center justify-between border border-[#F1F5F9] rounded-2xl p-4 mb-6">
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
                <p className="text-xs text-[#94A3B8] font-medium">
                  {event.title}
                </p>
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

          {/* Details Section */}
          <div className="border-2 border-[#3B82F6] rounded-xl p-5 mb-6">
            <h5 className="text-[13px] font-medium text-[#94A3B8] mb-4">
              Timing
            </h5>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-[#1E293B]" />
                <span className="text-sm font-semibold text-[#1E293B]">
                  {displayDate}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-[#1E293B]" />
                <span className="text-sm font-semibold text-[#1E293B]">
                  {event.time}
                </span>
              </div>
            </div>

            <h5 className="text-[13px] font-medium text-[#94A3B8] mt-6 mb-2">
              Subject
            </h5>
            <p className="text-sm font-bold text-[#1E293B]">{event.title}</p>
          </div>

          <div className="mb-6">
            <h5 className="text-[13px] font-medium text-[#94A3B8] mb-2 uppercase tracking-wide">
              Trainer Notes
            </h5>
            <div className="bg-[#F6EFE9] border border-[#EAC9B5] rounded-xl p-4 min-h-15">
              <p className="text-xs text-[#BC7F61] font-medium">
                {event.privateNote || "No notes provided."}
              </p>
            </div>
          </div>
          <div className="mb-6">
            <h5 className="text-[13px] font-medium text-[#94A3B8] mb-2 uppercase tracking-wide">
              Update Status
            </h5>

            <div className="flex gap-3">
              <button
                onClick={() => setStatus("missed")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border ${
                  status === "missed"
                    ? "bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]"
                    : "border-[#E5E7EB] text-[#64748B]"
                }`}
              >
                Missed
              </button>

              <button
                onClick={() => setStatus("completed")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border ${
                  status === "completed"
                    ? "bg-[#DCFCE7] text-[#22C55E] border-[#22C55E]"
                    : "border-[#E5E7EB] text-[#64748B]"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
          {/* Actions */}
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={onSendReminder}
              className="py-3.5 rounded-xl border border-[#F1F5F9] text-[#475569] font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Send Reminder
            </button>
            <button
              onClick={handleSaveStatus}
              disabled={isLoading}
              className="py-3.5 rounded-xl bg-[#afc8ff] cursor-pointer text-black font-bold text-sm hover:opacity-90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Status"}
            </button>
            <button
              onClick={onReschedule}
              className="py-3.5 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:opacity-90 transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
