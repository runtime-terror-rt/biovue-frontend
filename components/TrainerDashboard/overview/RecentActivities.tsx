"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle, Disc } from "lucide-react";
import { activities } from "./data";

export default function RecentActivity() {
  return (
    <Card className="p-5 bg-white">
      <h3 className="text-lg mb-3 font-semibold text-foreground">Recent Activity</h3>
      <div className="space-y-5">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-1">
              <Disc className="w-5 h-5 text-[#0D9488] shrink-0" />
            </div>
            <div className="flex-1">
              <p className="text-xl pb-2 font-medium">{activity.description}</p>
              <p className="text-sm text-[#5F6F73]">{activity.timeAgo} ago</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
