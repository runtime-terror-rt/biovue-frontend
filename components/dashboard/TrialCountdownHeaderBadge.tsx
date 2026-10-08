"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrialCountdown } from "@/lib/hooks/useTrialCountdown";
import { cn } from "@/lib/utils";

interface TrialCountdownHeaderBadgeProps {
  settingsHref?: string;
  className?: string;
}

export default function TrialCountdownHeaderBadge({
  settingsHref = "/user-dashboard/settings?tab=subscription",
  className,
}: TrialCountdownHeaderBadgeProps) {
  const [mounted, setMounted] = useState(false);
  const { isTrial, remainingDays, targetPlan } = useTrialCountdown();
  const [showTooltip, setShowTooltip] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isTrial || remainingDays === null) return null;

  const isUrgent = remainingDays <= 2;
  const isExpired = remainingDays <= 0;

  const dayLabel = isExpired
    ? "Ends Today"
    : `${remainingDays} ${remainingDays === 1 ? "Day" : "Days"} Left`;

  const targetPlanLabel =
    typeof targetPlan === "string"
      ? targetPlan
      : (targetPlan as any)?.name || (targetPlan as any)?.plan_name || null;

  return (
    <div
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Link href={settingsHref}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "group relative flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs font-semibold shadow-xs transition-all duration-300 cursor-pointer overflow-hidden shrink-0",
            isUrgent
              ? "bg-gradient-to-r from-[#FFF1F2] to-[#FFE4E6] border-rose-300/80 text-rose-700 shadow-rose-100"
              : "bg-gradient-to-r from-[#EEF6FF] via-[#F0FDF9] to-[#E6F8F6] border-[#3A86FF]/25 text-[#1F2D2E] hover:border-[#3A86FF]/50 shadow-[#3A86FF]/5",
          )}
        >
          {/* Subtle animated shimmer background */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {/* Icon with pulsing indicator */}
          <div
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0",
              isUrgent
                ? "bg-rose-500 text-white"
                : "bg-[#3A86FF] text-white shadow-xs",
            )}
          >
            <Clock size={11} strokeWidth={2.5} className="animate-spin-slow" />
          </div>

          {/* Text labels */}
          <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
            <span
              className={cn(
                "hidden md:inline text-[10px] font-bold uppercase tracking-wider",
                isUrgent ? "text-rose-500" : "text-[#3A86FF]",
              )}
            >
              Trial:
            </span>
            <span
              className={cn(
                "font-black tracking-tight text-[10px] sm:text-xs whitespace-nowrap",
                isUrgent ? "text-rose-700" : "text-[#0FA4A9]",
              )}
            >
              <span className="sm:hidden">{isExpired ? "0d" : `${remainingDays}d`}</span>
              <span className="hidden sm:inline">{dayLabel}</span>
            </span>
            {targetPlanLabel && (
              <span className="hidden xl:inline-flex items-center text-[10px] font-semibold text-[#5F6F73] ml-0.5">
                • <span className="ml-1 text-[#0FA4A9]">{targetPlanLabel}</span>
              </span>
            )}
          </div>

          {/* Pulse dot */}
          <span className="relative hidden xs:flex h-1.5 w-1.5 sm:h-2 sm:w-2 ml-0.5">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                isUrgent ? "bg-rose-400" : "bg-[#0FA4A9]",
              )}
            />
            <span
              className={cn(
                "relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2",
                isUrgent ? "bg-rose-500" : "bg-[#0FA4A9]",
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
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-60 sm:w-64 max-w-[calc(100vw-1.5rem)] p-3 bg-white rounded-xl shadow-xl border border-gray-100 text-left pointer-events-none"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#3A86FF] mb-1">
              <Sparkles size={12} />
              <span>7-Day Free Trial</span>
            </div>
            <p className="text-xs text-[#5F6F73] leading-relaxed">
              {isExpired
                ? "Your trial has concluded. Your selected plan will be activated."
                : `You have ${remainingDays} ${remainingDays === 1 ? "day" : "days"} remaining in your free trial.`}
            </p>
            {targetPlanLabel && (
              <p className="text-[11px] font-semibold text-[#1F2D2E] mt-1 pt-1 border-t border-gray-100">
                Next plan: <span className="text-[#0FA4A9]">{targetPlanLabel}</span> (auto-billed after trial)
              </p>
            )}
            <p className="text-[10px] text-[#94A3B8] mt-1">
              Click to view or manage in settings
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
