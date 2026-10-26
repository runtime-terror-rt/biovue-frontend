"use client";

import React from "react";
import { useSubscriptionStatus } from "@/lib/hooks/useSubscriptionStatus";
import { Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function MemberLimitIndicator() {
  const {
    member_limit = 0,
    used_seats = 0,
    total_seats = 0,
    remaining_seats = 0,
    seats_ratio = "0/0",
    isLoading,
  } = useSubscriptionStatus();

  const effectiveTotal = total_seats > 0 ? total_seats : member_limit;
  const effectiveRemaining =
    effectiveTotal > 0
      ? Math.max(0, effectiveTotal - used_seats)
      : remaining_seats;
  const effectiveRatio =
    effectiveTotal > 0 ? `${used_seats}/${effectiveTotal}` : seats_ratio || "0/0";

  const isAlert = effectiveTotal > 0 && effectiveRemaining <= 1;

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

  const tooltipText = `${used_seats} out of ${effectiveTotal} seats occupied • ${effectiveRemaining} seats left`;

  return (
    <div className="flex items-center shrink-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${effectiveRatio}-${effectiveRemaining}`}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className={cn(
            "relative flex items-center gap-1.5 p-0.5 sm:p-1 rounded-[14px] sm:rounded-[16px] border transition-all duration-500 backdrop-blur-md overflow-hidden shrink-0",
            isAlert
              ? "bg-white/95 border-orange-200 shadow-sm"
              : "bg-white/80 border-blue-100/50"
          )}
        >
          <div
            title={tooltipText}
            className={cn(
              "flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[10px] sm:rounded-[12px] border shadow-xs transition-all duration-300",
              isAlert
                ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-orange-400"
                : "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400"
            )}
          >
            <div className="flex items-center justify-center shrink-0">
              {isAlert ? (
                <AlertCircle size={15} strokeWidth={2.8} className="text-white" />
              ) : (
                <Users size={15} strokeWidth={2.5} className="text-white" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-[0.08em] leading-none opacity-90">
                  Seats
                </span>
                <span className="text-[8px] sm:text-[8.5px] font-semibold text-blue-100 leading-none">
                  • {effectiveRemaining} left
                </span>
              </div>

              <div className="flex items-baseline gap-1 mt-0.5 leading-none">
                <span className="text-[12px] sm:text-[13px] font-black leading-none tracking-tight">
                  {effectiveRatio}
                </span>
                <span className="text-[8.5px] font-semibold text-blue-100/90 leading-none hidden md:inline">
                  seats
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}