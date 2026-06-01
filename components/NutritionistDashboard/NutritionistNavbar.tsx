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

export default function NutritionistNavbar() {
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
    if (path === "/nutritionist-dashboard") return "Dashboard";
    if (path.includes("/nutritionist-dashboard/upgrade")) return "Upgrade";
    if (path.includes("/nutritionist-dashboard/settings")) return "Settings";
    if (path.includes("/nutritionist-dashboard/clients")) return "My Clients";
    if (path.includes("/nutritionist-dashboard/messages")) return "Messages";
    if (path.includes("/nutritionist-dashboard/notifications")) return "Notifications";
    if (path.includes("/nutritionist-dashboard/overview")) return "Overview";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between py-4 bg-white border-b border-gray-100 px-6 w-full shrink-0">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-[#1F2D2E]">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <ProjectionLimitIndicator />
        <ExpiryIndicator />
        <NotificationBell iconSize={22} />
        
        {/* Divider */}
        <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>

        {/* Unified Profile Dropdown */}
        <ProfileDropdown 
          roleLabel="Nutritionist" 
          settingsHref="/nutritionist-dashboard/settings" 
        />

        <Link href="/nutritionist-dashboard/upgrade">
          <button className="flex items-center gap-2 bg-[#0FA4A9] text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm cursor-pointer shadow-sm shadow-[#0FA4A9]/20 active:scale-95">
            <Crown size={18} fill="currentColor" />
            Upgrade
          </button>
        </Link>
      </div>
      {showPlans && <ProfessionalPlansModal onClose={() => window.history.replaceState({}, "", window.location.pathname)} />}
    </header>
  );
}
