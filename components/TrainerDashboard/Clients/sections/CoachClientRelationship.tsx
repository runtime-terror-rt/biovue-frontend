"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, CheckCircle2, Clock, FileText } from "lucide-react";

export default function CoachClientRelationship() {
  const items = [
    {
      icon: MessageCircle,
      label: "Send Message",
      color: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: CheckCircle2,
      label: "Add Goal Achieved",
      color: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: Clock,
      label: "Schedule Check-in",
      color: "bg-yellow-50",
      iconColor: "text-yellow-500",
    },
    {
      icon: FileText,
      label: "Add Program",
      color: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coach-Client Interaction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`${item.color} p-4 rounded-lg hover:shadow-md transition-shadow flex flex-col items-center gap-2 cursor-pointer`}
              >
                <Icon className={`${item.iconColor} w-6 h-6`} />
                <span className="text-sm font-medium text-[#1F2937] text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
          <h4 className="font-semibold text-[#1F2937] mb-4">Recent Messages</h4>
          <div className="space-y-3">
            <div className="flex gap-3 items-start bg-[#F3F4F6] p-3 rounded-lg">
              <div className="w-8 h-8 bg-[#0D9488] rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold">
                C
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  Coach Message
                </p>
                <p className="text-xs text-[#6B7280] mt-1">
                  Great job on your workouts this week!
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
