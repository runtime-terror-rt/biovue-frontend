"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Send, Calendar } from "lucide-react";
import { ActionCard } from "./data";
import Link from "next/link";

export const actionCards: ActionCard[] = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Review nutrition progress",
    description: "Check recent food logs and updates",
    linkText: "GO TO CLIENTS",
    href: "/nutritionist-dashboard/clients",
  },
  {
    icon: <Send className="w-6 h-6" />,
    title: "Send meal advice",
    description: "Send nutritional tips or reminders",
    linkText: "GO TO MESSAGES",
    href: "/nutritionist-dashboard/messages",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Review consultations",
    description: "View scheduled calls for today",
    linkText: "GO TO OVERVIEW",
    href: "/nutritionist-dashboard/overview",
  },
];

export default function Actions() {
  return (
    <div className="">
      <h3 className="text-lg font-medium text-foreground mb-4">
        Today's actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {actionCards.map((action, index) => (
          <Card key={index} className="p-5 bg-white">
            <div className="flex items-start">
              <div className="p-3 w-13 h-13 mb-2 bg-[#9AAEB233] rounded-lg text-[#0FA4A9]">
                {action.icon}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-foreground mb-1">{action.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {action.description}
              </p>
              <Link href={action.href}>
                <Button
                  variant="link"
                  className="text-[#0FA4A9] cursor-pointer p-0 h-auto font-semibold"
                >
                  {action.linkText} →
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
