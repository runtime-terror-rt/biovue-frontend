"use client";

import NotificationBell from "../dashboard/NotificationBell";
import ProfileDropdown from "../dashboard/ProfileDropdown";
import ProfessionalPlansModal from "@/components/ProfessionalPlans/ProfessionalPlansModal";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crown } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import ProjectionLimitIndicator from "../dashboard/ProjectionLimitIndicator";
import ExpiryIndicator from "../dashboard/ExpiryIndicator";
import MemberLimitIndicator from "../dashboard/MemberLimitIndicator";

export default function TrainerNavbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const showPlans = !!searchParams?.get("showPlans");

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPageTitle = () => {
    if (!mounted) return "Dashboard";
    const path = pathname?.toLowerCase();
    if (path === "/trainer-dashboard") return "Dashboard";
    if (path.includes("/trainer-dashboard/upgrade")) return "Upgrade";
    if (path.includes("/trainer-dashboard/settings")) return "Settings";
    if (path.includes("/trainer-dashboard/clients")) return "My Clients";
    if (path.includes("/trainer-dashboard/programs")) return "Programs";
    if (path.includes("/trainer-dashboard/messages")) return "Messages";
    if (path.includes("/trainer-dashboard/notifications"))
      return "Notifications";
    if (path.includes("/trainer-dashboard/calendar")) return "Calendar";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between py-4 bg-white border-b border-gray-100 px-4 md:px-6 w-full shrink-0">
      <div className="flex flex-col pl-12 md:pl-0 flex-1 min-w-0 pr-2">
        <h1 className="text-lg md:text-xl font-semibold text-[#1F2D2E] truncate">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        <div className="hidden sm:flex items-center gap-2 sm:gap-4 md:gap-6">
          <ProjectionLimitIndicator />
          <MemberLimitIndicator />
          <ExpiryIndicator />
        </div>
        <NotificationBell iconSize={22} />

        {/* Divider */}
        <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>

        {/* Unified Profile Dropdown */}
        <ProfileDropdown
          roleLabel="Trainer"
          settingsHref="/trainer-dashboard/settings"
        />

        <Link href="/trainer-dashboard/upgrade">
          <button className="flex items-center gap-1 sm:gap-2 bg-[#0FA4A9] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all text-xs sm:text-sm cursor-pointer shadow-sm shadow-[#0FA4A9]/20 active:scale-95">
            <Crown size={18} fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Upgrade</span>
          </button>
        </Link>
      </div>
      {showPlans && (
        <ProfessionalPlansModal
          onClose={() =>
            window.history.replaceState({}, "", window.location.pathname)
          }
        />
      )}
    </header>
  );
}
