"use client";

import { poppins } from "@/app/font";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { Crown } from "lucide-react";
import ProjectionLimitIndicator from "@/components/dashboard/ProjectionLimitIndicator";
import NotificationBell from "@/components/dashboard/NotificationBell";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPageTitle = () => {
    if (!mounted) return "Dashboard";
    const path = pathname?.toLowerCase();
    if (path === "/user-dashboard") return "Dashboard";
    if (path.includes("/user-dashboard/projections")) return "Projections";
    if (path.includes("/user-dashboard/projection-galary")) return "Projection Galary";
    if (path.includes("/user-dashboard/assigned-programs")) return "Assigned Programs";
    if (path.includes("/user-dashboard/insights")) return "Insights";
    if (path.includes("/user-dashboard/habits")) return "Habits";
    if (path.includes("/user-dashboard/support")) return "Support";
    if (path.includes("/user-dashboard/messages")) return "Message";
    if (path.includes("/user-dashboard/settings")) return "Settings";
    if (path.includes("/user-dashboard/upgrade")) return "Upgrade";
    if (path.includes("/user-dashboard/notifications")) return "Notifications";
    
    return "Dashboard";
  };

  return (
    <ProtectedRoute allowedRoles={["individual"]} allowedProfessions={[null]}>
      <div className={`flex min-h-screen bg-[#F4FBFA] ${poppins.className}`}>
        {/* Sidebar - Fixed width container to reserve space on desktop */}
      
        <Suspense fallback={<div className="w-20 md:w-65 border-r border-gray-200" />}>
          <Sidebar role="user" />
        </Suspense>

        {/* Right side */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header - Now persistent in Layout */}
          <header className="sticky top-0 z-20 flex items-center justify-between py-4 bg-white border-b border-gray-100 px-6 w-full">
            <h1 className="text-xl font-semibold text-[#1F2D2E]">
              {getPageTitle()}
            </h1>
            <div className="flex items-center gap-6 ml-auto">
              <ProjectionLimitIndicator />
              <NotificationBell />
              <div className="flex items-center gap-3 pr-2">
                <ProfileDropdown roleLabel="User" settingsHref="/user-dashboard/settings" />
              </div>
              <Link href="/user-dashboard/upgrade">
                <button className="flex items-center gap-2 bg-[#0FA4A9] text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm cursor-pointer shadow-sm shadow-[#0FA4A9]/20 active:scale-95">
                  <Crown size={18} fill="currentColor" />
                  Upgrade
                </button>
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
