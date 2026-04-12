"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LogOut, Menu, X, ChevronDown } from "lucide-react";
import { SIDEBAR_MENU, MenuItem } from "./SidebarMenu";
import Tooltip from "@/components/Tooltip";

import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "@/redux/features/slice/authSlice";

type Role = "user" | "trainer" | "admin" | "nutritionist";

interface SidebarProps {
  role: Role;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const menu = SIDEBAR_MENU[role] as MenuItem[];

  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const isRestricted = (() => {
    if (role !== "user" || !user?.created_at) return false;

    const createdDate = new Date(user.created_at);
    const today = new Date();
    const diffInDays = (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays > 7 || !user.plan_id;
  })();

  const restrictedLabels = ["Projections", "Projection Galary", "Insights", "Habits", "Support", "Message"];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const toggleSubmenu = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSubmenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  useEffect(() => {
    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    const currentSubmenus = menu
      .filter((item) =>
        item.children?.some((child) => fullPath.startsWith(child.href)),
      )
      .map((item) => item.label);

    if (currentSubmenus.length === 0) return;

    const id = setTimeout(() => {
      setOpenSubmenus((prev) => {
        const newState = Array.from(new Set([...prev, ...currentSubmenus]));
        return newState;
      });
    }, 0);

    return () => clearTimeout(id);
  }, [pathname, searchParams, menu]);

  // Handle server-side rendering or non-mounted state
  const showContent = mounted && (isExpanded || window.innerWidth >= 768);

  return (
    <>
      {/* Hamburger Menu Button - Visible on mobile */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {isExpanded ? (
          <X size={24} className="fixed right-45" />
        ) : (
          <Menu size={24} />
        )}
      </button>

      {/* Overlay - Visible when sidebar is expanded on mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sticky top-0 self-start h-screen z-40 bg-white flex flex-col px-3 py-8 md:px-6 transition-all duration-300 ease-in-out border-r border-gray-200 ${
          isExpanded
            ? "w-65 translate-x-0"
            : "w-20 -translate-x-full md:translate-x-0 md:w-65"
        }`}
      >
        {/* Logo */}
        <div
          className={`mb-8 transition-all duration-300 flex items-center justify-center md:block 
             w-16 md:w-25 h-8 md:h-14 `}
        >
          <Link href="/" className="block">
            <Image
              src="/images/logo.png"
              alt="BioVue"
              width={99}
              height={56}
              className={`object-contain w-full h-full`}
            />
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto no-scrollbar">
          {menu.map((item) => {
            const Icon = item.icon;
            const isRootDashboard =
              item.href === "/user-dashboard" ||
              item.href === "/trainer-dashboard/overview" ||
              item.href === "/admin-dashboard/overview";
            const isActive = isRootDashboard
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openSubmenus.includes(item.label);
            const isItemRestricted = isRestricted && restrictedLabels.includes(item.label);

            return (
              <div key={item.label} className="w-full">
                {/* Parent Menu Item */}
                <div className="flex items-center group relative">
                  {isItemRestricted ? (
                    <Tooltip message="To access this feature, you need an active subscription plan.">
                      <div
                        className={`flex-1 flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap text-gray-400 opacity-50 cursor-not-allowed`}
                      >
                        <Icon size={20} className="shrink-0" />
                        {showContent && <span>{item.label}</span>}
                      </div>
                    </Tooltip>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsExpanded(false)}
                      className={`flex-1 cursor-pointer flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        isActive
                          ? "bg-[#3A86FF25] text-black"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={20} className="shrink-0" />
                      {showContent && <span>{item.label}</span>}
                    </Link>
                  )}

                  {hasChildren && showContent && (
                    <button
                      onClick={(e) => toggleSubmenu(item.label, e)}
                      className={`absolute right-2 p-1 rounded-md hover:opacity-80 text-gray-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                       }`}
                    >
                      <ChevronDown className="cursor-pointer" size={24} />
                    </button>
                  )}
                </div>

                {/* Submenu Children */}
                {hasChildren &&
                  isOpen &&
                  showContent && (
                    <div className="ml-9 mt-1 flex flex-col gap-1 border-l border-gray-100">
                      {item.children?.map((child) => {
                        const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
                        const isChildActive = fullPath === child.href;
                        const isChildRestricted = isRestricted && restrictedLabels.includes(child.label);

                        if (isChildRestricted) {
                          return (
                            <Tooltip message="To access this feature, you need an active subscription plan.">
                              <div
                                key={child.label}
                                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors text-gray-400 opacity-50 cursor-not-allowed`}
                              >
                                - {child.label}
                              </div>
                            </Tooltip>
                          );
                        }

                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setIsExpanded(false)}
                            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                              isChildActive
                                ? "text-[#3A86FF] bg-[#3A86FF10]"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            - {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
              </div>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 whitespace-nowrap cursor-pointer ${
            isExpanded ? "" : "justify-center px-2 md:px-4 md:justify-start"
          }`}
          title={isExpanded ? "" : "Sign Out"}
        >
          <LogOut size={18} className="shrink-0" />
          {isExpanded && <span>Sign Out</span>}
          <span className="hidden md:inline">{!isExpanded && "Sign Out"}</span>
        </button>
      </aside>
    </>
  );
}
