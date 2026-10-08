"use client";

import { poppins } from "@/app/font";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { Crown } from "lucide-react";
import ProjectionLimitIndicator from "@/components/dashboard/ProjectionLimitIndicator";
import ExpiryIndicator from "@/components/dashboard/ExpiryIndicator";
import TrialCountdownHeaderBadge from "@/components/dashboard/TrialCountdownHeaderBadge";
import NotificationBell from "@/components/dashboard/NotificationBell";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDynamicUserPlan } from "@/lib/hooks/useDynamicUserPlan";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { isFree, isPlus, isPremium } = useDynamicUserPlan();

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
    if (path.includes("/user-dashboard/schedule")) return "Schedule & Reminders";
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
        <div className="flex flex-col flex-1 min-w-0 max-w-full">
          {/* Header - Responsive for all devices */}
          <header className="sticky top-0 z-20 flex items-center justify-between py-2 sm:py-3 md:py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 px-2 sm:px-4 md:px-6 w-full max-w-full shrink-0">
            {/* Title & Hamburger Spacing */}
            <div className="flex items-center min-w-0 flex-1 pr-1 sm:pr-2 pl-[50px] sm:pl-14 md:pl-0">
              <h1 className="text-xs sm:text-base md:text-xl font-bold md:font-semibold text-[#1F2D2E] truncate tracking-tight">
                {getPageTitle()}
              </h1>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 shrink-0">
              {/* Status Indicators Group */}
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
                <TrialCountdownHeaderBadge />
                
                {/* Secondary Indicators - Visible on tablet/desktop to save mobile header space */}
                <div className="hidden sm:flex items-center gap-1 sm:gap-2 shrink-0">
                  <ProjectionLimitIndicator />
                  <ExpiryIndicator />
                </div>
              </div>

              {/* Notification Bell */}
              <NotificationBell iconSize={18} className="shrink-0" />

              {/* Divider on sm+ */}
              <div className="hidden sm:block h-5 sm:h-6 w-px bg-gray-200/70 shrink-0" />

              {/* Profile Dropdown */}
              <div className="flex items-center shrink-0">
                <ProfileDropdown roleLabel="User" settingsHref="/user-dashboard/settings" />
              </div>

              {/* Subscription Plan Badge / Upgrade CTA */}
              {mounted && (
                <div className="flex items-center shrink-0">
                  {isPremium ? (
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-[#FFF4E5] text-[#E65100] border border-[#FFE0B2] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg text-[11px] sm:text-xs md:text-sm font-bold shadow-xs select-none shrink-0">
                      <Crown size={14} fill="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF8A00]" />
                      <span className="hidden xs:inline sm:inline">Premium</span>
                    </div>
                  ) : isPlus ? (
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <div className="hidden md:flex items-center gap-1.5 bg-[#E6F8F6] text-[#0FA4A9] border border-[#0FA4A9]/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-xs select-none">
                        <Crown size={15} fill="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0FA4A9]" />
                        <span>Plus</span>
                      </div>
                      <Link href="/user-dashboard/upgrade" className="shrink-0">
                        <button className="flex items-center gap-1 sm:gap-1.5 bg-[#0FA4A9] hover:bg-[#0D8E92] text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg font-semibold transition-all text-[11px] sm:text-xs md:text-sm cursor-pointer shadow-sm shadow-[#0FA4A9]/20 active:scale-95 whitespace-nowrap shrink-0">
                          <Crown size={13} fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
                          <span>Upgrade</span>
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <Link href="/user-dashboard/upgrade" className="shrink-0">
                      <button className="flex items-center gap-1 sm:gap-1.5 bg-[#0FA4A9] hover:bg-[#0D8E92] text-white px-2 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg font-semibold transition-all text-[11px] sm:text-xs md:text-sm cursor-pointer shadow-sm shadow-[#0FA4A9]/20 active:scale-95 whitespace-nowrap shrink-0">
                        <Crown size={13} fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
                        <span className="hidden sm:inline">Start Paid Plan</span>
                        <span className="sm:hidden">Upgrade</span>
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden w-full">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
