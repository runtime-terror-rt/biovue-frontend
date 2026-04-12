"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, User, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout } from "@/redux/features/slice/authSlice";
import { useLogoutMutation } from "@/redux/features/api/auth/authApi";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutMutation] = useLogoutMutation();
  const { data: profileResponse } = useGetProfileQuery(user?.id, { skip: !user?.id });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileImage =
    profileResponse?.data?.profile?.image ||
    user?.profile_image ||
    user?.image ||
    user?.avatar ||
    user?.profile?.image ||
    user?.photo_url ||
    user?.photoURL ||
    null;

  const displayName =
    profileResponse?.data?.name ||
    user?.name ||
    user?.fullName ||
    user?.username ||
    (user?.email ? user.email.split("@")[0] : "User");

  const getDashboardPath = () => {
    if (!user) return "/login";

    const userRole = user?.role;
    const userType = user?.user_type;
    const professionType = user?.profession_type;

    if (userRole === "admin") return "/admin-dashboard/overview";

    if (userType === "professional" || userRole === "professional") {
      if (professionType === "trainer_coach") return "/trainer-dashboard/overview";
      if (professionType === "supplement_supplier") return "/supplier-dashboard";
      if (professionType === "nutritionist") return "/nutritionist-dashboard/overview";
      return "/personalize-journey/onboarding";
    }

    if (userRole === "individual") return "/user-dashboard";

    return "/personalize-journey/onboarding";
  };

  const getRoleLabel = () => {
    if (!user) return "Member";
    const userRole = user?.role || user?.user_type;
    const professionType = user?.profession_type;

    if (userRole === "admin") return "Admin";
    if (userRole === "professional") {
      if (professionType === "trainer_coach") return "Trainer/Coach";
      if (professionType === "supplement_supplier") return "Supplier";
      if (professionType === "nutritionist") return "Nutritionist";
      return "Professional";
    }
    return "Member";
  };

  const handleDashboardClick = () => {
    const dashboardUrl = getDashboardPath();
    router.push(dashboardUrl);
  };

  const handleLogout = async () => {
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent mt-6">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="BioVue Logo"
            width={120}
            height={60}
            className="w-24 md:w-[120px] object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {!user && (
            <>
              <Link
                href="/login"
                className="text-main-text font-medium hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="group bg-[#0FA4A9] text-white pl-6 pr-2 py-2 rounded-full flex items-center gap-2.5 hover:bg-[#0d8d91] transition-all shadow-[0_4px_14px_0_rgba(15,164,169,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                Get Started
                <div className="bg-white rounded-full p-1 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-sm">
                  <ArrowUpRight size={15} className="text-black" strokeWidth={3} />
                </div>
              </Link>
            </>
          )}

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-gray-100 transition-all cursor-pointer group bg-white border border-gray-100 shadow-sm"
                aria-label="User menu"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:shadow-md transition-all bg-gray-50 flex items-center justify-center">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="User Profile"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full rounded-full transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <User size={20} className="text-[#94A3B8]" />
                    )}
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-bold text-[#1F2D2E] group-hover:text-[#0FA4A9] transition-colors line-clamp-1">
                    {displayName}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-[#64748B] transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Account Info</p>
                      <p className="text-sm font-bold text-[#1F2D2E] truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleDashboardClick();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#5F6F73] hover:bg-[#F0FDFA] hover:text-[#0FA4A9] transition-all text-left"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer text-left"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-white text-main-text w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-gray-100 hover:bg-gray-50 transition-all focus:outline-none cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-xl px-4 py-8 flex flex-col items-center gap-6 animate-in slide-in-from-top duration-300">
          {!user ? (
            <>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-main-text text-xl font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="group bg-[#0FA4A9] text-white px-10 py-3.5 rounded-full font-bold text-lg w-full text-center flex items-center justify-center gap-3 hover:bg-[#0d8d91] transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20 active:scale-95"
              >
                Get Started
                <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                  <ArrowUpRight size={18} className="text-[#0FA4A9]" strokeWidth={3} />
                </div>
              </Link>
            </>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center gap-4 p-2 rounded-full bg-gray-50 border border-gray-100">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-50 flex items-center justify-center">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="User Profile"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <User size={24} className="text-[#94A3B8]" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-[#1F2D2E] truncate max-w-[180px]">{displayName}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleDashboardClick();
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-[#0FA4A9] text-white py-3.5 rounded-full font-bold text-lg hover:bg-[#0d8d91] transition-all shadow-lg shadow-[#0FA4A9]/20 active:scale-95"
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-white text-red-500 py-3.5 rounded-full font-bold text-lg border border-red-100 hover:bg-red-50 transition-all active:scale-95"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
