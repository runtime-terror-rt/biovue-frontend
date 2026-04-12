"use client";

import { useCreateReminderMutation } from "@/redux/features/api/TrainerDashboard/Calendar/CreateReminder";
import { useGetTrainerOverviewQuery } from "@/redux/features/api/TrainerDashboard/trainerOverviewApi";
import { X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SendReminderModal({ isOpen, onClose }: Props) {
  const { data: overviewData, isLoading: isClientsLoading } = useGetTrainerOverviewQuery();
  const clients = overviewData?.client_table || [];

  const [reminderType, setReminderType] = useState<
    "motivation" | "habit" | "missed"
  >("motivation");
  const [deliveryMethod, setDeliveryMethod] = useState({
    inApp: true,
    push: false,
  });
  const [message, setMessage] = useState("");
  const [clientId, setClientId] = useState<number | null>(null);

  // Set default client ID when data loads or modal opens
  useEffect(() => {
    if (isOpen && clients.length > 0 && clientId === null) {
      setClientId(clients[0].user_id);
    }
  }, [isOpen, clients, clientId]);

  const [createReminder, { isLoading }] = useCreateReminderMutation();

  const handleSendReminder = async () => {
    if (!clientId) {
      toast.error("Please select a client");
      return;
    }
    try {
      const response = await createReminder({
        client_id: clientId,
        reminder_type: reminderType,
        message,
        in_app: deliveryMethod.inApp,
        push_notification: deliveryMethod.push,
      }).unwrap();

      toast.success(response.message || "Reminder sent successfully");

      setMessage("");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send reminder");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-125 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-8 pb-4 relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
            Send Reminder
          </h2>
          <p className="text-sm text-[#64748B]">
            Nudge your clients toward their goals.
          </p>
        </div>

        <div className="p-8 pt-2 space-y-6">
          {/* Client Select */}
          <div>
            <label className="block text-sm font-medium text-[#64748B] mb-2 uppercase tracking-wide">
              Clients
            </label>
            <div className="relative group">
              <select
                value={clientId ?? ""}
                onChange={(e) => setClientId(Number(e.target.value))}
                className="w-full appearance-none bg-[#F0FDFD] border border-[#CCFBF1] text-[#0D9488] px-5 py-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 transition-all cursor-pointer"
              >
                <option value="" disabled>
                  {isClientsLoading ? "Loading clients..." : "Select Client"}
                </option>
                {clients.map((client) => (
                  <option key={client.user_id} value={client.user_id}>
                    {client.user_name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D9488] pointer-events-none group-hover:scale-110 transition-transform"
                size={20}
              />
            </div>
          </div>

          {/* Reminder Type */}
          <div>
            <label className="block text-sm font-medium text-[#64748B] mb-3 uppercase tracking-wide">
              Reminder Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["motivation", "habit", "missed"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setReminderType(type)}
                  className={`py-3.5 rounded-xl text-sm font-semibold capitalize transition-all border-2 ${
                    reminderType === type
                      ? "bg-[#0D9488] text-white border-[#0D9488]"
                      : "bg-[#F0FDFD] text-[#0D9488] border-[#CCFBF1] hover:border-[#0D9488]/30"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="block text-sm font-medium text-[#64748B] mb-2 uppercase tracking-wide">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your motivation message here.."
              className="w-full h-40 bg-white border border-[#CCFBF1] rounded-2xl p-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 resize-none transition-all placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-[#64748B] mb-3 uppercase tracking-wide">
              Delivery Method
            </label>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${deliveryMethod.inApp ? "bg-[#0D9488] border-[#0D9488]" : "border-[#CCFBF1] bg-[#F1F5F9]"}`}
                >
                  {deliveryMethod.inApp && (
                    <X size={14} className="text-white rotate-45" />
                  )}
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={deliveryMethod.inApp}
                    onChange={(e) =>
                      setDeliveryMethod({
                        ...deliveryMethod,
                        inApp: e.target.checked,
                      })
                    }
                  />
                </div>
                <span className="text-sm font-medium text-[#1E293B] group-hover:text-[#0D9488] transition-colors">
                  In-app Message
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${deliveryMethod.push ? "bg-[#0D9488] border-[#0D9488]" : "border-[#CCFBF1] bg-[#F1F5F9]"}`}
                >
                  {deliveryMethod.push && (
                    <X size={14} className="text-white rotate-45" />
                  )}
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={deliveryMethod.push}
                    onChange={(e) =>
                      setDeliveryMethod({
                        ...deliveryMethod,
                        push: e.target.checked,
                      })
                    }
                  />
                </div>
                <span className="text-sm font-medium text-[#1E293B] group-hover:text-[#0D9488] transition-colors">
                  Push Notification
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={onClose}
              className="py-4 rounded-xl border border-[#F1F5F9] text-[#1E293B] font-bold text-sm hover:bg-gray-50 transition-colors uppercase tracking-widest cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSendReminder}
              disabled={isLoading}
              className="py-4 rounded-xl bg-[#0D9488] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-[0.98] uppercase tracking-widest cursor-pointer"
            >
              {isLoading ? "Sending..." : "Send Reminder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
