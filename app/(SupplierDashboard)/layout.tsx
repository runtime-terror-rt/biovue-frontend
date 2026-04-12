"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/dashboard/NotificationBell";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
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

export default function SupplierDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getPageTitle = () => {
    if (!mounted) return "Dashboard";
    const path = pathname?.toLowerCase();
    if (path === "/supplier-dashboard") return "Dashboard";
    if (path === "/supplier-dashboard/products") return "My Products";
    if (path === "/supplier-dashboard/add-product") return "Add New Product";
    if (path === "/supplier-dashboard/clients") return "Clients";
    if (path === "/supplier-dashboard/messages") return "Messages";
    if (path === "/supplier-dashboard/settings") return "Settings";
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
    <ProtectedRoute allowedRoles={["professional"]} allowedProfessions={["supplement_supplier"]}>
    <div className="flex h-screen bg-[#F3F8FF] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-[#E4EFFF] flex flex-col transition-all duration-300",
          isSidebarOpen ? "w-[300px]" : "w-[80px]",
        )}
      >
        {/* Sidebar Logo */}
        <div className="h-24 flex items-center px-10 py-10">
          <Link href="/" className="block cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="BioVue Logo"
              width={100}
              height={38}
              className={cn("object-contain", !isSidebarOpen && "hidden")}
              priority
            />
          </Link>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 px-8 space-y-4">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-5 px-6 py-4 rounded-xl transition-all group",
                mounted && pathname === item.href
                  ? "bg-[#E4F0FF] text-[#041228]"
                  : "text-[#041228] hover:bg-gray-50",
              )}
            >
              <item.icon
                size={26}
                strokeWidth={1.2}
                className="text-[#041228]"
              />
              {isSidebarOpen && (
                <span className="text-[16px] font-normal leading-[24px] tracking-tight whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-8">
          <div className="h-px bg-gray-100 w-full mb-10" />
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-5 w-full px-6 py-4 text-[#041228] hover:bg-gray-50 rounded-xl transition-all group cursor-pointer",
            )}
          >
            <LogOut size={26} strokeWidth={1.2} className="text-[#041228]" />
            {isSidebarOpen && (
              <span className="font-poppins text-base font-light leading-6">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-[#E4EFFF] flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-medium text-[#041228]">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <NotificationBell iconSize={24} />
            <div className="flex items-center gap-3 pl-2">
              <ProfileDropdown
                roleLabel="Supplier"
                settingsHref="/supplier-dashboard/settings"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
