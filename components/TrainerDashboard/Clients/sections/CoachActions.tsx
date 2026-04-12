"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  FileText,
  Calendar,
  Edit,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CoachActions() {
  const router = useRouter();
  const actions = [
    { icon: MessageSquare, label: "Send Message", action: "message" },
    { icon: FileText, label: "Add Motivation Note", action: "motivation" },
    { icon: Calendar, label: "Schedule Check-in", action: "checkin" },
    { icon: Edit, label: "Adjust Program", action: "adjust-program" },
  ];
  const handleActionClick = (action: string) => {
    switch (action) {
      case "adjust-program":
        router.push("/trainer-dashboard/clients/adjust-program");
        break;
      case "message":
        router.push("/send-message");
        break;
      case "motivation":
        router.push("/add-note");
        break;
      case "checkin":
        router.push("/schedule-checkin");
        break;
      default:
        break;
    }
  };
  return (
    <div className="space-y-4  bg-white p-6 rounded-lg">
      <div className="flex items-center gap-2 text-[#111827]">
        <Activity size={18} />
        <h2 className="text-xl font-medium  uppercase">COACH ACTIONS</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action.action)}
            className="flex cursor-pointer items-center justify-center gap-3 p-6 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors group"
          >
            <div className="p-2 rounded-lg bg-[#0FA4A9] text-white">
              <action.icon
                size={18}
                className=" group-hover:scale-110 transition-transform"
              />
            </div>

            <span className="text-base font-semibold text-[#374151]">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
