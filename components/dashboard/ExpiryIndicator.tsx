"use client";

import React from "react";
import { useSubscriptionStatus } from "@/lib/hooks/useSubscriptionStatus";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface ExpiryIndicatorProps {
  diffDays?: number;
  isAlert?: boolean;
}

export default function ExpiryIndicator({
  diffDays: propDiffDays,
  isAlert: propIsAlert,
}: ExpiryIndicatorProps) {
  const status = useSubscriptionStatus();

  const isLoading = status.isLoading;
  const diffDays =
    propDiffDays !== undefined ? propDiffDays : (status.diffDays ?? 0);
  const isAlert = propIsAlert !== undefined ? propIsAlert : !status.isSafe;

  // Render nothing if we are loading and don't have explicit props passed
  if (isLoading && propDiffDays === undefined) return null;

  // Animation variants
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

  const glowVariants: Variants = {
    animate: {
      boxShadow: isAlert
        ? [
            "0px 0px 0px rgba(239, 68, 68, 0)",
            "0px 0px 15px rgba(239, 68, 68, 0.4)",
            "0px 0px 0px rgba(239, 68, 68, 0)",
          ]
        : "0px 0px 0px rgba(16, 185, 129, 0)",
      transition: {
        repeat: Infinity,
        duration: 2.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={diffDays}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className={cn(
            "relative flex items-center gap-0.5 p-1 rounded-3xl border transition-all duration-500 backdrop-blur-md overflow-hidden",
            isAlert
              ? "bg-white/95 border-red-200 shadow-sm"
              : "bg-white/80 border-emerald-100/50", // Subtler safe state
          )}
        >
          {/* Eye-catching background glow for alerts */}
          {isAlert && (
            <motion.div
              variants={glowVariants}
              animate="animate"
              className="absolute inset-0 z-0 pointer-events-none"
            />
          )}

          <div className="relative z-10 flex items-center gap-2.5 px-3 py-1.5">
            <motion.div
              animate={isAlert ? { rotate: [0, 3, -3, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className={cn(
                "p-1.5 rounded-lg transition-colors duration-500 shadow-inner bg-gray-50/50",
                isAlert ? "text-red-600" : "text-emerald-600",
              )}
            >
              <Calendar size={14} strokeWidth={2.5} />
            </motion.div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-[8px] font-bold uppercase tracking-wider leading-none",
                  isAlert ? "text-red-400" : "text-emerald-500",
                )}
              >
                Expires
              </span>
              <motion.span
                className={cn(
                  "text-[13px] font-black leading-none mt-1 flex items-center gap-1",
                  isAlert ? "text-red-700" : "text-emerald-700",
                )}
              >
                {diffDays <= 0 ? (
                  <span className="uppercase text-[10px] tracking-tight">
                    Expired
                  </span>
                ) : (
                  <>
                    {diffDays}
                    <span className="text-[9px] font-bold opacity-60 uppercase ml-0.5">
                      Days
                    </span>
                  </>
                )}
              </motion.span>
            </div>

            {/* Pulsing indicator dot for warnings */}
            {isAlert && (
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{ repeat: Infinity, duration: 1 }}
                className={cn(
                  "w-2 h-2 rounded-full ml-0.5 shadow-sm bg-red-500 shadow-red-200",
                )}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
