"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSubscriptionStatus } from "@/lib/hooks/useSubscriptionStatus";
import { Calendar, AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ExpiryIndicatorProps {
  diffDays?: number;
  isAlert?: boolean;
  className?: string;
  forceShow?: boolean;
}

export default function ExpiryIndicator({
  diffDays: propDiffDays,
  isAlert: propIsAlert,
  className,
  forceShow,
}: ExpiryIndicatorProps) {
  const status = useSubscriptionStatus();
  const [showTooltip, setShowTooltip] = useState(false);

  const isLoading = status.isLoading;
  const isCancelled = status.isCancelled;
  const accessUntil = status.accessUntil;
  const diffDays =
    propDiffDays !== undefined ? propDiffDays : (status.diffDays ?? 0);

  // Live countdown state
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
    isOver: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    formatted: "",
    isOver: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      let targetTime = status.expiryTimestamp;

      if (!targetTime && accessUntil) {
        const parsed = new Date(accessUntil).getTime();
        if (!isNaN(parsed)) {
          targetTime = parsed;
        }
      }

      if (!targetTime && diffDays > 0) {
        targetTime = Date.now() + diffDays * 24 * 60 * 60 * 1000;
      }

      if (!targetTime) {
        return;
      }

      const diffMs = targetTime - Date.now();

      if (diffMs <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          formatted: "Expired",
          isOver: true,
        });
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      let formatted = "";
      if (days > 0) {
        formatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else if (hours > 0) {
        formatted = `${hours}h ${minutes}m ${seconds}s`;
      } else {
        formatted = `${minutes}m ${seconds}s`;
      }

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        formatted,
        isOver: false,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [status.expiryTimestamp, accessUntil, diffDays]);

  // If loading and no props passed, return null
  if (isLoading && propDiffDays === undefined) return null;

  // Show if cancellation was requested OR if explicit alert or forceShow
  const shouldShow =
    forceShow ||
    isCancelled ||
    (status.hasExpiry && (diffDays <= 7 || !status.isSafe));

  if (!shouldShow) return null;

  const isExpired = countdown.isOver || diffDays <= 0;
  const isAlert =
    propIsAlert !== undefined
      ? propIsAlert
      : (isExpired || isCancelled || !status.isSafe || diffDays <= 7);

  // If live countdown is available, use it; otherwise fallback to accessUntil or day count
  const displayLabel = countdown.formatted
    ? countdown.formatted
    : accessUntil || (diffDays > 0 ? `${diffDays} Days` : "Today");

  return (
    <div
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Link href="/user-dashboard/settings?tab=subscription">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-xs transition-all duration-300 cursor-pointer overflow-hidden select-none",
            isExpired
              ? "bg-gradient-to-r from-[#FFF1F2] to-[#FFE4E6] border-rose-300/80 text-rose-700 shadow-rose-100"
              : isCancelled
                ? "bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FFF7ED] border-[#F59E0B]/40 text-[#92400E] hover:border-[#F59E0B]/70 shadow-amber-50"
                : isAlert
                  ? "bg-gradient-to-r from-[#FFF1F2] to-[#FFE4E6] border-rose-300/80 text-rose-700 shadow-rose-100"
                  : "bg-gradient-to-r from-[#EEF6FF] via-[#F0FDF9] to-[#E6F8F6] border-[#3A86FF]/25 text-[#1F2D2E] hover:border-[#3A86FF]/50",
          )}
        >
          {/* Subtle animated shimmer background */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {/* Icon with pulsing indicator */}
          <div
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
              isExpired
                ? "bg-rose-500 text-white"
                : isCancelled
                  ? "bg-[#D97706] text-white shadow-xs"
                  : isAlert
                    ? "bg-rose-500 text-white"
                    : "bg-[#0FA4A9] text-white shadow-xs",
            )}
          >
            {isCancelled ? (
              <Clock size={11} strokeWidth={2.5} className="animate-spin-slow" />
            ) : (
              <Calendar size={11} strokeWidth={2.5} />
            )}
          </div>

          {/* Text labels */}
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                isExpired
                  ? "text-rose-500"
                  : isCancelled
                    ? "text-[#B45309]"
                    : "text-[#0FA4A9]",
              )}
            >
              {isExpired ? "Expired" : "Expires In:"}
            </span>
            <span
              className={cn(
                "font-black font-mono tracking-tight text-[11px]",
                isExpired
                  ? "text-rose-700 font-sans"
                  : isCancelled
                    ? "text-[#78350F]"
                    : "text-[#0FA4A9]",
              )}
            >
              {displayLabel}
            </span>
          </div>

          {/* Pulse dot */}
          <span className="relative flex h-2 w-2 ml-0.5">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                isExpired
                  ? "bg-rose-400"
                  : isCancelled
                    ? "bg-amber-400"
                    : "bg-[#0FA4A9]",
              )}
            />
            <span
              className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                isExpired
                  ? "bg-rose-500"
                  : isCancelled
                    ? "bg-amber-500"
                    : "bg-[#0FA4A9]",
              )}
            />
          </span>
        </motion.div>
      </Link>

      {/* Floating Hover Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-72 p-3.5 bg-white rounded-xl shadow-xl border border-gray-100 text-left pointer-events-none"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 mb-1">
              <AlertTriangle size={13} />
              <span>
                {isCancelled
                  ? "Cancellation Active (Countdown Running)"
                  : isExpired
                    ? "Subscription Expired"
                    : "Subscription Expiring"}
              </span>
            </div>
            <p className="text-xs text-[#5F6F73] leading-relaxed">
              {isCancelled
                ? `You retain full access until ${accessUntil || "the end of your period"}. After this countdown reaches zero, your subscription will not renew.`
                : isExpired
                  ? "Your subscription period has ended. Please renew to continue accessing premium features."
                  : `Your subscription will expire on ${accessUntil || displayLabel}.`}
            </p>
            {isCancelled && countdown.formatted && !isExpired && (
              <div className="mt-2 p-2 bg-amber-50/80 rounded-lg border border-amber-200/60 flex items-center justify-between text-[11px]">
                <span className="text-amber-800 font-medium">Time Remaining:</span>
                <span className="font-mono font-bold text-amber-900">
                  {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </span>
              </div>
            )}
            <p className="text-[10px] text-[#0FA4A9] font-bold mt-2 pt-1 border-t border-gray-100 flex items-center justify-between">
              <span>Click to view in Subscription Settings</span>
              <ArrowRight size={10} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
