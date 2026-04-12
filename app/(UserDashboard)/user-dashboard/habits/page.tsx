"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Bed,
  Apple,
  Footprints,
  Frown,
  Droplets,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCardDataQuery } from "@/redux/features/api/userDashboard/habit";
import { useGetAiSavedHabitsQuery, useUpdateAiHabitsMutation } from "@/redux/features/api/userDashboard/Projection/AIHabitsAPI";
import { Loader2, Activity as ActivityIcon, RefreshCw } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";

const DEFAULT_HABITS = [
  {
    title: "Sleep",
    status: "Good",
    avg: "7h 30m Average",
    ratio: "7/7 Days",
  },
  {
    title: "Nutrition",
    status: "Need Attention",
    avg: "2100 kcal Average",
    ratio: "5/7 Days",
  },
  {
    title: "Activity",
    status: "Good",
    avg: "8,500 Steps Average",
    ratio: "6/7 Days",
  },
  {
    title: "Stress",
    status: "Good",
    avg: "Low Stress",
    ratio: "7/7 Days",
  },
  {
    title: "Hydration",
    status: "Good",
    avg: "2.5L Average",
    ratio: "7/7 Days",
  },
];

export default function HabitsPage() {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || currentUser?.user_id;

  const { data: cardData, isLoading: isLoadingCards } = useGetCardDataQuery();
  const { data: habitData, isLoading: isLoadingHabits } = useGetAiSavedHabitsQuery(userId, { skip: !userId });
  const [updateHabits, { isLoading: isUpdating }] = useUpdateAiHabitsMutation();
  

  console.log(cardData, "carddata frontend page ");
  console.log(habitData, "habitData - insights");

  const handleUpdateInsights = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }
    try {
      await updateHabits({ user_id: userId }).unwrap();
      toast.success("Habits updated successfully");
    } catch (err) {
      toast.error("Failed to update habits");
      console.error(err);
    }
  };

  if (isLoadingCards || isLoadingHabits) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0FA4A9]" />
      </div>
    );
  }

  // Merge habits from habitData into the card format
  const getConsistencyMetrics = () => {
    const baseMetrics = cardData?.data?.consistency_metrics || DEFAULT_HABITS;
    
    if (!habitData?.habits) return baseMetrics;

    return baseMetrics.map((metric: any) => {
      const habitKey = metric.title.toLowerCase();
      const insight = habitData.habits[habitKey];
      
      if (insight) {
        return {
          ...metric,
          status: insight.status.replace("_", " ").toLowerCase().split(" ").map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
          biovue_insights: insight.biovue_insights,
          why_this_matters: insight.why_this_matters,
        };
      }
      return metric;
    });
  };

  const consistencyMetrics = getConsistencyMetrics();

  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case "sleep":
        return <Bed size={24} className="text-[#3A86FF]" />;
      case "nutrition":
        return <Apple size={24} className="text-[#0FA4A9]" />;
      case "activity":
        return <Footprints size={24} className="text-[#3A86FF]" />;
      case "stress":
        return <Frown size={24} className="text-[#A855F7]" />;
      case "hydration":
        return <Droplets size={24} className="text-[#3A86FF]" />;
      default:
        return <ActivityIcon size={24} className="text-[#3A86FF]" />;
    }
  };

  const iconsBgMap: Record<string, string> = {
    sleep: "bg-blue-100",
    nutrition: "bg-[#E6F6F6]",
    activity: "bg-blue-100",
    stress: "bg-purple-100",
    hydration: "bg-blue-100",
  };
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-6 md:p-8 container  mx-auto w-full">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/user-dashboard"
            className="flex items-center gap-2 px-4 py-2 border border-[#3A86FF]/30 text-[#5F6F73] hover:text-[#1F2D2E] hover:bg-blue-50/50 rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <button
            onClick={handleUpdateInsights}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-[#0FA4A9] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={16} className={cn(isUpdating && "animate-spin")} />
            {isUpdating ? "Updating..." : "Refresh Habits"}
          </button>
        </div>

        {/* <button className="flex items-center gap-2 bg-[#0FA4A9] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm shadow-sm cursor-pointer">
          <Plus size={18} />
          Log Today&apos;s Habit
        </button> */}
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {consistencyMetrics.map((habit: any, index: number) => {
          const habitId = habit.title.toLowerCase();
          const isNeedAttention = habit.status === "Need Attention";

          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 border border-[#3A86FF]/25 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-blue-100 transition-colors"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      iconsBgMap[habitId] || "bg-blue-100",
                    )}
                  >
                    {getIcon(habit.title)}
                  </div>
                  <span
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border text-nowrap",
                      isNeedAttention
                        ? "bg-pink-100 text-pink-500 border-pink-200"
                        : "bg-teal-100 text-[#0FA4A9] border-teal-200",
                    )}
                  >
                    {habit.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <h3 className="text-[22px] font-bold text-[#1F2D2E]">
                    {habit.title}
                  </h3>
                  <p className="text-[#5F6F73] text-[15px] italic ">
                    &quot;{habit.avg}&quot;
                  </p>
                </div>

                {/* Consistency Bar */}
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                    <span>Consistency</span>
                    <span>{habit.ratio}</span>
                  </div>
                  <div className="flex items-center gap-1.5 w-full">
                    {/* Parse ratio e.g., "2/7 Days" */}
                    {[...Array(7)].map((_, i) => {
                      const completedCount =
                        parseInt(habit.ratio?.split("/")[0]) || 0;
                      const isComplete = i < completedCount;
                      return (
                        <div
                          key={i}
                          className={cn(
                            "h-1.5 flex-1 rounded-full",
                            isComplete
                              ? isNeedAttention
                                ? "bg-[#EA580C]"
                                : "bg-[#0FA4A9]"
                              : "bg-gray-100",
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <Link
                href={`/user-dashboard/habits/${habitId}`}
                className="mt-8"
              >
                <button className="w-full bg-[#5C82C8] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all text-sm group cursor-pointer shadow-sm">
                  View Details
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Focus on Trends Banner */}
      <div className="bg-[#EEF2FC] rounded-3xl p-6 border border-[#2563EB]/10 flex items-center gap-4 mt-auto shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-[#5C82C8] flex items-center justify-center shrink-0 shadow-sm">
          <Calendar size={24} className="text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-[#1F2D2E] font-bold text-lg">Focus on Trends</h4>
          <p className="text-[#5C82C8] text-sm italic">
            {(habitData?.data?.focus_on_trends || habitData?.focus_on_trends) || "Missing a day happens. BioVue focuses on long-term consistency over perfection."}
          </p>
        </div>
      </div>
    </div>
  );
}
