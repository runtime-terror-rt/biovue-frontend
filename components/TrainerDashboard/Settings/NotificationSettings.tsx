"use client";

import React, { useState, useEffect } from "react";
import SettingsSection from "./SettingsSection";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/redux/features/api/userDashboard/notificationApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_SETTINGS = {
  coach_messages: 1,
  client_messages: 1,
  goal_updates: 1,
  check_in_reminder_alerts: 1,
  ai_insights: 1,
  subscription_updates: 1,
  missed_checkin_alerts: 1,
  program_milestone_updates: 1,
  weekly_summary_email: 1,
  auto_remind_missed_checkins: 1,
  default_reminder_time: "08:00 AM",
};

export default function NotificationSettings() {
  const {
    data: notificationSettingsData,
    isLoading: isLoadingSettings,
    refetch: refetchSettings,
  } = useGetNotificationSettingsQuery();

  const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();

  const [localSettings, setLocalSettings] = useState<any>(null);

  // ✅ Always sync with API data
  useEffect(() => {
    if (notificationSettingsData?.data) {
      setLocalSettings(notificationSettingsData.data);
    } else if (!isLoadingSettings && !notificationSettingsData?.data) {
      // Fallback to defaults if no data exists yet
      setLocalSettings(DEFAULT_SETTINGS);
    }
  }, [notificationSettingsData, isLoadingSettings]);

  // ✅ Toggle handler (fixed)
  const handleToggle = async (key: string) => {
    // Use current localSettings or fallback to defaults
    const currentSettings = localSettings || DEFAULT_SETTINGS;
    const currentValue = currentSettings[key] ?? 0;
    const newValue = currentValue === 1 ? 0 : 1;

    // Optimistic update
    setLocalSettings((prev: any) => ({
      ...(prev || DEFAULT_SETTINGS),
      [key]: newValue,
    }));

    try {
      console.log("Updating:", key, newValue);

      // Send only the changed key as the payload (Standard for this API)
      const payload = { [key]: newValue };

      await updateNotificationSettings(payload).unwrap();
      
      toast.success("Notification settings updated");
      
      // Optionally refetch to ensure everything is in sync
      refetchSettings();
    } catch (error: any) {
      console.error("Failed to update settings:", error);
      
      // Revert if failed
      setLocalSettings((prev: any) => ({
        ...(prev || DEFAULT_SETTINGS),
        [key]: currentValue,
      }));

      toast.error(error?.data?.message || "Failed to update notification settings");
    }
  };

  const notificationItems = [
    {
      label: "Client Messages",
      sub: "Instant alerts when your clients write to you",
      key: "client_messages", // Fixed: was coach_messages
    },
    {
      label: "Goal Updates",
      sub: "Alerts when a client updates, edits, or completes their goals.",
      key: "goal_updates",
    },
    {
      label: "Check-in & Reminder Alerts",
      sub: "Reminders for scheduled client check-ins or missed logs.",
      key: "check_in_reminder_alerts",
    },
    {
      label: "AI Insights & Recommendations",
      sub: "Notifications when new AI-generated insights or suggestions are available.",
      key: "ai_insights",
    },
    {
      label: "Subscription & Account Updates",
      sub: "Billing reminders, plan changes, and important account notices.",
      key: "subscription_updates",
    },
    {
      label: "Missed Check-in Alerts",
      sub: "Alerts when clients miss their scheduled check-ins.",
      key: "missed_checkin_alerts",
    },
    {
      label: "Program Milestone Updates",
      sub: "Notifications about program progress and milestones.",
      key: "program_milestone_updates",
    },
    {
      label: "Weekly Summary Email",
      sub: "Receive a weekly summary of client progress and engagement.",
      key: "weekly_summary_email",
    },
    {
      label: "Auto Remind Missed Check-ins",
      sub: "Automatically send reminders to clients when they miss a check-in.",
      key: "auto_remind_missed_checkins",
    },
  ];

  // ✅ Loading state
  if (isLoadingSettings && !localSettings) {
    return (
      <SettingsSection className="border-none! shadow-none! bg-transparent! px-0!">
        <div className="bg-white rounded-3xl border border-[#F1F5F9] shadow-sm p-12 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0FA4A9]" size={32} />
        </div>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection className="border-none! shadow-none! bg-transparent! px-0!">
      <div className="bg-white rounded-3xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#F1F5F9]">
          <h3 className="text-[17px] font-bold text-[#0FA4A9]">
            Notifications
          </h3>
        </div>

        {/* Items */}
        <div className="px-8 py-4 divide-y divide-[#F1F5F9]">
          {notificationItems.map((item) => {
            const isActive = localSettings?.[item.key] === 1;

            return (
              <div
                key={item.key}
                className="py-6 flex items-center justify-between"
              >
                <div className="max-w-[80%]">
                  <h4 className="text-[15px] font-bold text-[#1E293B]">
                    {item.label}
                  </h4>
                  <p className="text-[13px] text-[#94A3B8] font-medium mt-1">
                    {item.sub}
                  </p>
                </div>

                {/* Toggle */}
                <div
                  role="button"
                  onClick={() => handleToggle(item.key)}
                  className={cn(
                    "w-11 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out",
                    isActive ? "bg-[#0FA4A9]" : "bg-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out",
                      isActive ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-[#F8FAFC]/50 border-t border-[#F1F5F9]">
          <p className="text-[13px] text-[#94A3B8] font-medium">
            Notifications help you stay updated on client progress and
            engagement.
          </p>
        </div>
      </div>
    </SettingsSection>
  );
}