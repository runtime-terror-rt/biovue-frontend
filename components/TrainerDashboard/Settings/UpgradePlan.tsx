"use client";

import Link from "next/link";
import SettingsSection from "./SettingsSection";
import { Crown } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";

export default function UpgradePlan() {
  const currentUser = useSelector(selectCurrentUser);

  const planName =
    currentUser?.plan_name || (currentUser?.plan_id ? "Active Plan" : "Free");

  const planDuration = currentUser?.plan_duration; // days left, optional

  return (
    <SettingsSection
      title="Upgrade Plan"
      description="Increase client limits and unlock premium trainer features"
      action={
        <Link href="/trainer-dashboard/upgrade">
          <button className="flex items-center gap-2 bg-[#0FA4A9] text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm cursor-pointer shadow-sm shadow-[#0FA4A9]/20 active:scale-95">
            <Crown size={16} fill="currentColor" />
            Upgrade
          </button>
        </Link>
      }
    >
      <div className="p-6">
        <p className="text-sm text-[#475569]">
          Current plan: <strong className="text-[#0F1724]">{planName}</strong>
          {planDuration ? ` — ${planDuration} days left` : ""}.
          Upgrade to increase client capacity, enable premium analytics, and access exclusive coaching tools.
        </p>
      </div>
    </SettingsSection>
  );
}
