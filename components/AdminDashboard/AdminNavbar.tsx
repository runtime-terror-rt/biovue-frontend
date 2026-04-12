"use client";

import NotificationBell from "../dashboard/NotificationBell";
import ProfileDropdown from "../dashboard/ProfileDropdown";

export default function AdminNavbar() {
  return (
    <header className="md:ml-6 py-4 bg-white px-8 flex items-center justify-between shadow-sm border-b border-gray-100 z-30 sticky top-0">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-[#1F2D2E] pl-10 md:pl-0">Dashboard</h1>
        <p className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider pl-10 md:pl-0">Admin Management</p>
      </div>

      <div className="flex items-center gap-6">
        <NotificationBell iconSize={24} />
        
        {/* Divider */}
        <div className="h-8 w-[1px] bg-gray-100 hidden sm:block"></div>

        {/* Unified Profile Dropdown */}
        <ProfileDropdown 
          roleLabel="Admin" 
          settingsHref="/admin-dashboard/settings" 
        />
      </div>
    </header>
  );
}
