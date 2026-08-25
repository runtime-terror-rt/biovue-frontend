"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HelpCircle, User, ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  displayName: string;
  currentUser: any;
  handleLogout: () => void;
}

export default function Header({ displayName, currentUser, handleLogout }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click for Profile Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo.png"
          alt="BioVue Logo"
          width={110}
          height={50}
          className="object-contain"
          priority
        />
        <span className="hidden sm:inline bg-teal-500/10 text-teal-600 text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-teal-500/20">
          Developer Ecosystem
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/pricing"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-950 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-gray-400" />
          View Pricing plans
        </Link>

        <div className="h-6 w-[1.5px] bg-gray-100 hidden md:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full hover:bg-slate-50 border border-slate-100 bg-white transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
              <User size={16} className="text-teal-600" />
            </div>
            <div className="text-left hidden sm:block flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 leading-tight truncate">
                {displayName}
              </p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">
                API Owner
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
            />
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
                <div className="px-4 py-3 border-b border-gray-50 mb-1 bg-slate-50/50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    Connected Credentials
                  </p>
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {currentUser?.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer text-left"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
