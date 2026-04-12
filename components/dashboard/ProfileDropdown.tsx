"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout } from "@/redux/features/slice/authSlice";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { useLogoutMutation } from "@/redux/features/api/auth/authApi";
import { User, ChevronDown, LogOut, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileDropdownProps {
  roleLabel: string;
  settingsHref: string;
}

export default function ProfileDropdown({ roleLabel, settingsHref }: ProfileDropdownProps) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: profileResponse } = useGetProfileQuery(user?.id, { skip: !user?.id });
  const [logoutMutation] = useLogoutMutation();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const profile = profileResponse?.data?.profile;
  const profileImage = profile?.image;
  const fullName = profileResponse?.data?.name || user?.name || "Professional";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer group"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:shadow-md transition-shadow bg-gray-50 flex items-center justify-center">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="User Profile"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <User size={20} className="text-[#94A3B8]" />
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-sm font-bold text-[#1F2D2E] group-hover:text-[#0FA4A9] transition-colors line-clamp-1">{fullName}</span>
          <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-tighter">{roleLabel}</span>
        </div>
        
        <ChevronDown 
          size={16} 
          className={`text-[#94A3B8] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
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
            
            <Link 
              href={settingsHref}
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#5F6F73] hover:bg-[#F0FDFA] hover:text-[#0FA4A9] transition-all"
            >
              <SettingsIcon size={18} />
              Settings
            </Link>
            
            <button 
              onClick={() => {
                setIsDropdownOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
