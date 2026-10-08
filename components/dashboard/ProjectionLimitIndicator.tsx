"use client";

import React from "react";
import { useSubscriptionStatus } from "@/lib/hooks/useSubscriptionStatus";
import { Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";


export default function ProjectionLimitIndicator() {
  const {
    projection_limit = 0,
    diffDays = 0,
    isSafe,
    isWarning,
    restricted: isBlocked,
    isLoading,
  } = useSubscriptionStatus();

  // Red when credits are 0 or 1, otherwise green
  const isAlert = projection_limit <= 1;

  if (isLoading) return null;

  // Animation variants
  const containerVariants: Variants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: isAlert ? [0, -1.5, 1.5, -1.5, 1.5, 0] : 0, // More subtle shake
      transition: {
        y: { duration: 0.4, ease: "easeOut" },
        x: isAlert
          ? { repeat: Infinity, duration: 0.5, repeatDelay: 2 }
          : { duration: 0 },
      },
    },
    hover: { scale: 1.02, transition: { duration: 0.2 } }, // Reduced hover zoom
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
    <div className="flex items-center shrink-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${projection_limit}-${diffDays}`}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className={cn(
            "relative flex items-center gap-0.5 p-0.5 sm:p-1 rounded-[12px] sm:rounded-[16px] border transition-all duration-500 backdrop-blur-md overflow-hidden shrink-0",
            isAlert
              ? "bg-white/95 border-red-200 shadow-xs"
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

          {/* Credits Section */}
          <div className="relative z-10 flex items-center shrink-0">
            <motion.div
              animate={isAlert ? { scale: [1, 1.03, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={cn(
                "flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-[9px] sm:rounded-[12px] transition-all duration-500 border shadow-xs",
                isAlert
                  ? "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400"
                  : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-400",
              )}
            >
              <div className="flex items-center justify-center">
                {isAlert ? (
                  <motion.div
                    animate={{
                      rotate: [0, -15, 15, -15, 15, 0],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      repeatDelay: 1,
                    }}
                  >
                    <AlertCircle size={13} strokeWidth={3} className="sm:w-3.5 sm:h-3.5" />
                  </motion.div>
                ) : (
                  <motion.div>
                    <Zap size={13} strokeWidth={3} className="fill-current sm:w-3.5 sm:h-3.5" />
                  </motion.div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] leading-none opacity-90 hidden lg:inline">
                  Credits
                </span>
                <span className="text-[11px] sm:text-[13px] font-black leading-none mt-0.5 sm:mt-1">
                  {projection_limit}
                </span>
              </div>
            </motion.div>
          </div>
          
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
