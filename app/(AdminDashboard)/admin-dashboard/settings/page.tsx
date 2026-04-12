"use client";

import DashboardHeading from "@/components/common/DashboardHeading";
import EditProfileForm from "@/components/AdminDashboard/Settings/EditProfileForm";
import DangerZone from "@/components/AdminDashboard/Settings/DangerZone";

export default function SettingsPage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="">
        <div className="mb-10">
          <DashboardHeading
            heading="Admin Profile"
            subheading="View and manage all platform settings"
          />
        </div>

        <div className="space-y-5 md:space-y-10">
          <EditProfileForm />
          <DangerZone />
        </div>
      </div>
    </div>
  );
}
