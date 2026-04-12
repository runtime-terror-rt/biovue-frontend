"use client";

import DashboardHeading from "@/components/common/DashboardHeading";
import ProfilePreferences from "@/components/NutritionistDashboard/Settings/ProfilePreferences";
import AccountPrivacy from "@/components/NutritionistDashboard/Settings/AccountPrivacy";

export default function SettingsPage() {
  return (
    <div className="min-h-screen pb-24">
      <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <DashboardHeading
            heading="Account Settings"
            subheading="Update your professional profile and manage your account security preferences."
            className="text-[#1F2D2E]"
          />
        </div>

        <div className="space-y-12">
          <ProfilePreferences />
          <AccountPrivacy />
        </div>

       
      </div>
    </div>
  );
}
