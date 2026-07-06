"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  PlusSquare,
  Settings,
  LogOut,
  Menu,
  Bell,
  X,
  User,
  Search,
  Users,
  Mail,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/dashboard/NotificationBell";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import ProfessionalPlansModal from "@/components/ProfessionalPlans/ProfessionalPlansModal";
import { useSearchParams } from "next/navigation";
import ProjectionLimitIndicator from "@/components/dashboard/ProjectionLimitIndicator";
import { useLogoutMutation } from "@/redux/features/api/auth/authApi";
import { logout } from "@/redux/features/slice/authSlice";
import { useAppDispatch } from "@/redux/store/hooks";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const MENU_ITEMS = [
  { icon: LayoutGrid, label: "Dashboard", href: "/supplier-dashboard" },
  { icon: Package, label: "My Products", href: "/supplier-dashboard/products" },
  {
    icon: PlusSquare,
    label: "Add New Product",
    href: "/supplier-dashboard/add-product",
  },
  { icon: Users, label: "Clients", href: "/supplier-dashboard/clients" },
  { icon: Mail, label: "Messages", href: "/supplier-dashboard/messages" },
  { icon: Settings, label: "Settings", href: "/supplier-dashboard/settings" },
];

export default function SupplierDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["professional"]} allowedProfessions={["supplement_supplier"]}>
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading dashboard...</div>}>
        <SupplierDashboardContent>{children}</SupplierDashboardContent>
      </Suspense>
    </ProtectedRoute>
  );
}

function SupplierDashboardContent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();

  React.useEffect(() => {
    setMounted(true);
    const checkWidth = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const searchParams = useSearchParams();
  const showPlans = !!searchParams?.get("showPlans");

  const getPageTitle = () => {
    if (!mounted) return "Dashboard";
    const path = pathname?.toLowerCase();
    if (path === "/supplier-dashboard") return "Dashboard";
    if (path === "/supplier-dashboard/products") return "My Products";
    if (path === "/supplier-dashboard/add-product") return "Add New Product";
    if (path === "/supplier-dashboard/clients") return "Clients";
    if (path === "/supplier-dashboard/messages") return "Messages";
    if (path === "/supplier-dashboard/settings") return "Settings";
    if (path.includes("/supplier-dashboard/upgrade")) return "Upgrade";
    return "Dashboard";
  };

  const handleSignOut = async () => {
    try {
      await logoutMutation({}).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logout());
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen bg-[#F4FBFA] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-[#E4EFFF] flex flex-col transition-all duration-300 absolute md:static z-40 h-full",
          isSidebarOpen ? "translate-x-0 w-[280px] md:w-[300px]" : "-translate-x-full md:translate-x-0 w-[280px] md:w-[80px]",
        )}
      >
        {/* Sidebar Logo */}
        <div className="h-24 flex items-center px-6 md:px-10 py-10 justify-between">
          <Link href="/" className="block cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="BioVue Logo"
              width={100}
              height={38}
              className={cn("object-contain", !isSidebarOpen && "md:hidden")}
              priority
            />
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 px-4 md:px-8 space-y-4 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => { if (window.innerWidth < 768) setIsSidebarOpen(false) }}
              className={cn(
                "flex items-center gap-5 px-4 md:px-6 py-4 rounded-xl transition-all group",
                mounted && pathname === item.href
                  ? "bg-[#E4F0FF] text-[#041228]"
                  : "text-[#041228] hover:bg-gray-50",
              )}
            >
              <item.icon
                size={26}
                strokeWidth={1.2}
                className="text-[#041228] shrink-0"
              />
              {isSidebarOpen && (
                <span className="text-[14px] md:text-[16px] font-normal leading-[24px] tracking-tight whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 md:p-8">
          <div className="h-px bg-gray-100 w-full mb-6 md:mb-10" />
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-5 w-full px-4 md:px-6 py-4 text-[#041228] hover:bg-gray-50 rounded-xl transition-all group cursor-pointer",
            )}
          >
            <LogOut size={26} strokeWidth={1.2} className="text-[#041228] shrink-0" />
            {isSidebarOpen && (
               <span className="font-poppins text-[14px] md:text-base font-light leading-6 whitespace-nowrap">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between py-4 bg-white border-b border-gray-100 px-4 md:px-6 w-full shrink-0">
          <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0 pr-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 shrink-0"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-medium text-[#041228] truncate">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 ml-auto">
            {/* <ProjectionLimitIndicator /> */}
            <NotificationBell iconSize={24} />
            <div className="flex items-center gap-1 sm:gap-3 md:pl-2">
              <ProfileDropdown
                roleLabel="Supplier"
                settingsHref="/supplier-dashboard/settings"
              />
            </div>
            <Link href="/supplier-dashboard/upgrade">
              <button className="flex items-center gap-1 sm:gap-2 bg-[#0FA4A9] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all text-xs sm:text-sm cursor-pointer shadow-sm shadow-[#0FA4A9]/20 active:scale-95">
                <Crown size={18} fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Upgrade</span>
              </button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">{children}</main>
        {showPlans && (
          <ProfessionalPlansModal onClose={() => {
            // remove query param by pushing same path without param
            const path = window.location.pathname;
            window.history.replaceState({}, "", path);
          }} />
        )}
      </div>
    </div>
  );
}
