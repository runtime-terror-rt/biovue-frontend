"use client";

import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import ScheduleCheckinModal from "../calendar/ScheduleCheckinModal";
import { useRouter } from "next/navigation";
import { ClientTableItem } from "@/redux/features/api/TrainerDashboard/trainerOverviewApi";

interface ClientDetailModalProps {
  client: ClientTableItem;
  onClose: () => void;
}

export default function ClientDetailModal({
  client,
  onClose,
}: ClientDetailModalProps) {
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const router = useRouter();

  const handleSendMessage = () => {
    // message page e navigate koro
    router.push(
      `/trainer-dashboard/messages?clientId=${client.user_id}&clientName=${encodeURIComponent(
        client.user_name,
      )}`,
    );
    onClose(); 
  };
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Client Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Client Name</p>
              <p className="text-lg font-bold text-gray-900">{client.user_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Goal</p>
              <p className="text-lg font-bold text-gray-900">{client.goal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#D3BB5B1A] text-[#D3BB5B]">
                {client.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Activity</p>
              <p className="text-lg font-bold text-gray-900">
                {client.activity}
              </p>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="font-semibold text-blue-900 mb-3">
              Recommended Actions
            </p>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Send a personalized check-in message to re-engage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  Review their program and adjust if needed for better fit
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button onClick={handleSendMessage} className="flex-1 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Send Message
            </button>
            <button
              onClick={() => setIsCheckinModalOpen(true)}
              className="flex-1 cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Schedule Check-in
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 cursor-pointer py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* Schedule Check-in Modal */}
      <ScheduleCheckinModal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
      />
    </div>
  );
}
