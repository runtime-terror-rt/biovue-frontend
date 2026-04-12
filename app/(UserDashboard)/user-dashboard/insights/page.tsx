"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  X,
  Zap,
  HeartPulse,
  Dumbbell,
  Moon,
  Scale,
  RefreshCcw,
  Calendar,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAiCurrentInsightsQuery, useGetAiFutureInsightsQuery, useUpdateAiCurrentInsightsMutation, useUpdateAiFutureInsightsMutation } from "@/redux/features/api/userDashboard/Projection/AIInsightsAPI";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";

// Mock data removed in favor of API integration

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<"5-year" | "current">("current");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || currentUser?.user_id;

  const { data: insightsData, isLoading: isLoadingInsights } = useGetAiCurrentInsightsQuery(userId, { skip: !userId });
  const { data: futureInsightsData, isLoading: isLoadingFuture } = useGetAiFutureInsightsQuery(userId, { skip: !userId });

  const [updateCurrentInsights, { isLoading: isUpdatingCurrent }] = useUpdateAiCurrentInsightsMutation();
  const [updateFutureInsights, { isLoading: isUpdatingFuture }] = useUpdateAiFutureInsightsMutation();

  const isUpdating = isUpdatingCurrent || isUpdatingFuture;

  const handleRefreshInsights = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }
    try {
      await Promise.all([
        updateCurrentInsights({ user_id: userId }).unwrap(),
        updateFutureInsights({ user_id: userId, timeframe: "5 years" }).unwrap()
      ]);
      toast.success("Insights refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh insights");
      console.error("Refresh Insights Error", error);
    }
  };

  const getCategoryStyles = (category: string) => {
    const cat = category?.toUpperCase() || "GENERAL";
    return "bg-[#E6F6F6] text-[#0FA4A9]";
  };

  const getPriorityStyles = (priority: string) => {
    const pr = priority?.toUpperCase() || "MEDIUM";
    if (pr === "HIGH") return "bg-pink-100 text-pink-500";
    if (pr === "LOW") return "bg-green-100 text-green-500";
    return "bg-blue-100 text-blue-500";
  };

  const getFutureStyles = (impact: string) => {
    const imp = impact?.toUpperCase() || "MODERATE";
    if (imp === "HIGH") return { bg: "bg-pink-100", text: "text-pink-500" };
    return { bg: "bg-green-100", text: "text-green-500" };
  };

  const getCategoryIcon = (category: string) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("nutrition")) return <Zap size={20} className="text-[#1F2D2E]" />;
    if (cat.includes("cardio") || cat.includes("heart")) return <HeartPulse size={20} className="text-[#1F2D2E]" />;
    if (cat.includes("exercise") || cat.includes("muscle")) return <Dumbbell size={20} className="text-[#1F2D2E]" />;
    if (cat.includes("sleep")) return <Moon size={20} className="text-[#1F2D2E]" />;
    return <Scale size={20} className="text-[#1F2D2E]" />;
  };

  const currentInsights = insightsData?.insights || insightsData?.data || [];
  const futureInsights = futureInsightsData?.insights || futureInsightsData?.data || [];
  const isLoading = activeTab === "current" ? isLoadingInsights : isLoadingFuture;

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-6 md:p-8 container mx-auto w-full">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1 bg-[#E6F6F6] p-1 rounded-lg border border-[#BDE8E8]">

         <button
            onClick={() => setActiveTab("current")}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer",
              activeTab === "current"
                ? "bg-[#0FA4A9] text-white shadow-sm"
                : "text-[#5F6F73] hover:text-[#1F2D2E]",
            )}
          >
            Current Projection
          </button>
          <button
            onClick={() => setActiveTab("5-year")}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer",
              activeTab === "5-year"
                ? "bg-[#0FA4A9] text-white shadow-sm"
                : "text-[#5F6F73] hover:text-[#1F2D2E]",
            )}
          >
            5 - Year Projection
          </button>
         
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleRefreshInsights}
            disabled={isUpdating}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#E6F6F6] text-[#0FA4A9] border border-[#BDE8E8] rounded-md text-xs font-semibold hover:bg-[#d0f0f0] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCcw size={14} className={cn(isUpdating && "animate-spin")} />
            {isUpdating ? "Refreshing..." : "Refresh Insights"}
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold hover:underline text-[#5F6F73] hover:text-[#1F2D2E] transition-colors cursor-pointer"
          >
            View Remain Projection Limits
            <Info size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#0FA4A9]" />
          </div>
        ) : activeTab === "5-year" ? (
          <motion.div
            key="5-year"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <div className="text-center mb-10">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0FA4A9] mb-3">
                Future Wellness Outlook(5-Year Projection)
              </h1>
              <p className="text-[#5F6F73] max-w-2xl mx-auto">
                Based on your current habits and lifestyle patterns if no
                changes are made over the next 5 years.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {futureInsights.map((proj: any, idx: number) => {
                const styles = getFutureStyles(proj.priority);
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center bg-[#FDE68A]/30",
                        )}
                      >
                        {getCategoryIcon(proj.category)}
                      </div>
                      <span
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          styles.bg,
                          styles.text,
                          styles.bg
                            .replace("bg-", "border-")
                            .replace("100", "200"),
                        )}
                      >
                        {proj.priority?.toUpperCase()} IMPACT
                      </span>
                    </div>

                    <div className="flex flex-col mt-2">
                      <h3 className="text-[#1F2D2E] font-medium text-[15px]">
                        {proj.insight}
                      </h3>
                      <p className="text-[#5F6F73] text-[10px] uppercase font-bold tracking-wider mt-1">
                        {proj.timeline || "PROJECTED OVER 5 YEARS"}
                      </p>
                    </div>

                    <ul className="flex flex-col gap-2.5 mt-2">
                      {(proj.expected_changes || []).map((bullet: string, bIdx: number) => (
                        <li key={bIdx} className="flex items-start gap-3">
                          <div className="mt-0.5 relative shrink-0">
                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[#3A86FF]">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          </div>
                          <span className="text-[#5F6F73] text-[13px]">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="current"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {currentInsights.map((proj: any, idx: number) => {
              const priorityBg = getPriorityStyles(proj.priority);
              const categoryBg = getCategoryStyles(proj.category);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-6"
                >
                  {/* Header */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          priorityBg,
                          priorityBg
                            .split(" ")[0]
                            .replace("bg-", "border-")
                            .replace("100", "200"),
                        )}
                      >
                        {proj.priority?.toUpperCase()} PRIORITY
                      </span>
                      <span
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          categoryBg,
                          categoryBg
                            .split(" ")[0]
                            .replace("bg-", "border-")
                            .replace("100", "200"),
                        )}
                      >
                        {proj.category?.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-[22px] font-bold text-[#3A86FF]">
                      {proj.insight}
                    </h2>

                    <div className="flex flex-col mt-2">
                      <div className="flex items-center gap-1.5 text-[#5F6F73] font-bold text-xs uppercase tracking-wider mb-2">
                        <Info size={14} /> WHY THIS MATTERS
                      </div>
                      <p className="text-[#5F6F73] italic text-sm">{proj.why_this_matters}</p>
                    </div>
                  </div>

                  {/* Expected Impact Box */}
                  <div className="bg-[#F8FBFF] rounded-xl p-5 border border-blue-50">
                    <h4 className="text-[#1F2D2E] font-bold text-sm mb-1.5">
                      Expected Impact
                    </h4>
                    <p className="text-[#3A86FF] text-sm">{proj.expected_impact}</p>
                  </div>

                  {/* Body: Action list & Trainer note */}
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-2">
                    <div className="flex-1 flex flex-col gap-4">
                      <h4 className="text-[#1F2D2E] font-bold text-sm">
                        Action Steps
                      </h4>
                      <ul className="flex flex-col gap-3">
                        {(proj.action_steps || []).map((step: string, sIdx: number) => (
                          <li key={sIdx} className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                              <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[#3A86FF]">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                            </div>
                            <span className="text-[#5F6F73] text-[13px]">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Footer Button - Only on left side in image */}
                      <div className="mt-2">
                        <button className="bg-[#0FA4A9] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition-all text-[13px] flex items-center gap-2 group w-fit cursor-pointer">
                          Go {proj.category?.charAt(0).toUpperCase() + proj.category?.slice(1)} Habit
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </button>
                      </div>
                    </div>

                    <div className="lg:w-[320px] shrink-0 bg-[#FFF5EB] rounded-2xl p-6 border border-orange-100/50 flex flex-col gap-4 h-fit">
                      <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-wider">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m5 16 1.5-1.5"></path>
                          <path d="m19 8-1.5 1.5"></path>
                          <path d="m4 8 2.5 2.5"></path>
                          <path d="m20 16-2.5-2.5"></path>
                          <circle cx="12" cy="12" r="4"></circle>
                        </svg>
                        TRAINER&apos;S NOTE
                      </div>
                      <p className="text-[#1F2D2E] text-xs font-medium leading-relaxed">
                        {proj.trainers_note}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projection Usage Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-[24px] p-6 shadow-2xl w-full max-w-90 pointer-events-auto relative pt-8"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute p-0.5 top-4 right-4 text-gray-500 hover:text-gray-800 border border-gray-300 rounded-full cursor-pointer transition-colors"
                >
                  <X size={14} />
                </button>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[#A855F7] text-[17px] font-semibold">
                      Projection Usage
                    </h3>
                    <p className="text-[#5F6F73] text-[13px]">
                      Track how many AI projections you&apos;ve used this cycle
                    </p>
                  </div>

                  {/* Progress Line */}
                  <div className="relative w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-[#0FA4A9] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[13px] text-[#1F2D2E]">
                      You&apos;ve used 2 of 2 projections
                    </div>
                    <div className="bg-gray-100 text-[#1F2D2E] px-2.5 py-1.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5">
                      <Calendar size={12} />
                      Resets in 8 days
                    </div>
                  </div>

                  <div className="text-[#0FA4A9] font-medium text-[13px]">
                    Last projection: 12 days ago
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


// dfsfljsda;lf