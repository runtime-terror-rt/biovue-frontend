"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  FileText,
  Calendar,
  Edit,
  Activity,
  Utensils,
  Sparkles,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ClientVisibilityModal from "./ClientVisibilityModal";

interface CoachActionsProps {
  clientDetails?: any;
}

export default function CoachActions({ clientDetails }: CoachActionsProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"food" | "projections" | "profile">("food");

  const clientId = clientDetails?.id || clientDetails?.user_id;
  const clientName = clientDetails?.name || "Client";

  const actions = [
    { icon: Utensils, label: "Food Log", action: "food-log", color: "bg-[#0FA4A9]" },
    { icon: Sparkles, label: "Projections", action: "projections", color: "bg-[#3A86FF]" },
    { icon: User, label: "Full Bio Profile", action: "profile", color: "bg-[#8B5CF6]" },
    { icon: Edit, label: "Adjust Program", action: "adjust-program", color: "bg-[#0D9488]" },
    { icon: MessageSquare, label: "Send Message", action: "message", color: "bg-[#10B981]" },
    { icon: Calendar, label: "Schedule Check-in", action: "checkin", color: "bg-[#F59E0B]" },
  ];

  const handleActionClick = (action: string) => {
    switch (action) {
      case "food-log":
        setModalTab("food");
        setModalOpen(true);
        break;
      case "projections":
        setModalTab("projections");
        setModalOpen(true);
        break;
      case "profile":
        setModalTab("profile");
        setModalOpen(true);
        break;
      case "adjust-program":
        router.push("/trainer-dashboard/clients/adjust-program");
        break;
      case "message":
        router.push(clientId ? `/trainer-dashboard/messages?clientId=${clientId}` : "/trainer-dashboard/messages");
        break;
      case "checkin":
        router.push("/trainer-dashboard/calendar");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between text-[#111827]">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-[#0FA4A9]" />
            <h2 className="text-xl font-medium uppercase">COACH ACTIONS & VISIBILITY</h2>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
            Full Client Visibility Active
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action.action)}
              className="flex cursor-pointer items-center justify-center gap-3 p-5 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] hover:border-gray-300 transition-all group shadow-xs hover:shadow-sm"
            >
              <div className={`p-2.5 rounded-lg ${action.color} text-white shrink-0`}>
                <action.icon
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </div>

              <span className="text-sm sm:text-base font-semibold text-[#374151]">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {clientId && (
        <ClientVisibilityModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          clientId={clientId}
          clientName={clientName}
          initialTab={modalTab}
        />
      )}
    </>
  );
}
