"use client";

import DashboardHeading from "@/components/common/DashboardHeading";
import ProfilePreferences from "@/components/TrainerDashboard/Settings/ProfilePreferences";
import NotificationSettings from "@/components/TrainerDashboard/Settings/NotificationSettings";
import RemindersAutomation from "@/components/TrainerDashboard/Settings/RemindersAutomation";
import ClientVisibility from "@/components/TrainerDashboard/Settings/ClientVisibility";
import MessagingPreferences from "@/components/TrainerDashboard/Settings/MessagingPreferences";
import AccountPrivacy from "@/components/TrainerDashboard/Settings/AccountPrivacy";

export default function SettingsPage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="mb-10">
        <DashboardHeading
          heading="Settings"
          subheading="Manage your account preferences, notifications, and coaching controls"
        />
      </div>

      <div className=" space-y-10">
        <ProfilePreferences />
        <NotificationSettings />
        {/* <RemindersAutomation />
        <ClientVisibility />
        <MessagingPreferences /> */}
        <AccountPrivacy />
      </div>
    </div>
  );
}
