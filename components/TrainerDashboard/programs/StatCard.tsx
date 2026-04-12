"use client";

import { AlertCircle, Activity, User } from "lucide-react";
import { Card } from "../../ui/card";

export interface StatCard {
  icon: React.ReactNode;
  number: string | number;
  label: string;
  description: string;
}

export default function StatCards({ activeCount = 0 }: { activeCount?: number }) {
  const statCards: StatCard[] = [
    {
      icon: <Activity className="w-6 h-6" />,
      number: activeCount,
      label: "Active Programs",
      description: "Currently assigned to clients",
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      number: 0,
      label: "Draft Programs",
      description: "Not yet assigned",
    },
    {
      icon: <User className="w-6 h-6" />,
      number: 18, // Keeping this as mock for now as client data might be different API
      label: "Clients in Programs",
      description: "Active participants",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-5 bg-white">
          <div className="flex flex-col items-start gap-4">
            <div className="p-3 w-13 h-13 bg-[#0FA4A926] rounded-lg text-[#0D9488]">
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
