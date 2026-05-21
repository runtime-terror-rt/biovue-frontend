"use client";

import React from "react";
import { useSubscriptionStatus } from "@/lib/hooks/useSubscriptionStatus";
import { Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function MemberLimitIndicator() {
  const {
    member_limit = 0,
    isSafe,
    isLoading,
  } = useSubscriptionStatus();

  const isAlert = !isSafe;

  if (isLoading) return null;

  const containerVariants: Variants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: isAlert ? [0, -1.5, 1.5, -1.5, 1.5, 0] : 0,
      transition: {
        y: { duration: 0.4, ease: "easeOut" },
        x: isAlert
          ? { repeat: Infinity, duration: 0.5, repeatDelay: 2 }
          : { duration: 0 },
      },
    },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={member_limit}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className={cn(
            "relative flex items-center gap-2 p-1 rounded-[16px] border transition-all duration-500 backdrop-blur-md overflow-hidden",
            isAlert
              ? "bg-white/95 border-orange-200 shadow-sm"
              : "bg-white/80 border-blue-100/50"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-[12px] border shadow-sm",
              isAlert
                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-400"
                : "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400"
            )}
          >
            {isAlert ? (
              <AlertCircle size={14} strokeWidth={3} />
            ) : (
              <Users size={14} strokeWidth={3} />
            )}

            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase tracking-[0.1em] leading-none opacity-90">
                Members
              </span>

              <span className="text-[13px] font-black leading-none mt-1">
                {member_limit}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}