"use client";

import { useRouter } from "next/navigation";
import { Users, AlertCircle, MessageSquare, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TrainerStats } from "@/redux/features/api/TrainerDashboard/trainerOverviewApi";

interface StatCardsProps {
  stats?: TrainerStats;
  isLoading?: boolean;
}

export default function StatCards({ stats, isLoading }: StatCardsProps) {
  const router = useRouter();

  const statCardsData = [
    {
      icon: <Users className="w-6 h-6" />,
      number: stats?.active_clients?.value || 0,
      label: stats?.active_clients?.label || "Active Clients",
      description: "Currently coached",
      key: "active_clients",
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      number: stats?.needing_attention?.value || 0,
      label: stats?.needing_attention?.label || "Clients Needing Attention",
      description: "Off-track or low activity",
      key: "needing_attention",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      number: stats?.pending_messages?.value || 0,
      label: stats?.pending_messages?.label || "Pending Messages",
      description: "Unread client messages",
      key: "pending_messages",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      number: stats?.todays_checkins?.value || 0,
      label: stats?.todays_checkins?.label || "Todays Check-ins",
      description: "Scheduled Today",
      key: "todays_checkins",
    },
  ];

  const handleCardClick = (key: string) => {
    if (key === "needing_attention") {
      router.push("/trainer-dashboard/clients-need-attention");
    }
    if (key === "active_clients") {
      router.push("/trainer-dashboard/active-clients");
    }
    if (key === "pending_messages") {
      router.push("/trainer-dashboard/messages");
    }
    if (key === "todays_checkins") {
      router.push("/trainer-dashboard/calendar");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 bg-white animate-pulse">
            <div className="h-40 bg-gray-100 rounded-lg"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {statCardsData.map((stat, index) => (
        <Card
          key={index}
          className={`p-5 bg-white cursor-pointer hover:shadow-lg`}
          onClick={() => handleCardClick(stat.key)}
        >
          <div className="flex flex-col items-start gap-4">
            <div className="p-3 w-13 h-13 bg-[#9AAEB233] rounded-lg text-[#0D9488]">
              {stat.icon}
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-medium text-foreground">
                {stat.number}
              </div>
              <div className="text-lg font-medium text-foreground">
                {stat.label}
              </div>
              <div className="text-base text-[#5F6F73] ">
                {stat.description}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
