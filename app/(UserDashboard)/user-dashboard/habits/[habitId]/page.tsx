"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BarChart2, CheckCircle2, Bed, Apple, Footprints, Frown, Droplets, Plus, Activity as ActivityIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCardDataQuery, useGetHabitsQuery } from "@/redux/features/api/userDashboard/habit";
import { Loader2 } from "lucide-react";
import LogHabitModal from "@/components/dashboard/LogHabitModal";
import LogNutritionModal from "@/components/dashboard/LogNutritionModal";
import LogNutritionView from "@/components/dashboard/LogNutritionView";
import LogStressView from "@/components/dashboard/LogStressView";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";

import { useGetSleepReportQuery } from "@/redux/features/api/userDashboard/sleeplog";
import { useGetActivityReportQuery } from "@/redux/features/api/userDashboard/activitylog";
import { useGetStressReportQuery } from "@/redux/features/api/userDashboard/stresslog";
import { useGetHydrationReportQuery } from "@/redux/features/api/userDashboard/hydration";
import { useGetNutritionReportQuery } from "@/redux/features/api/userDashboard/nutrition";
import { useGetAiSuggestedTargetQuery } from "@/redux/features/api/userDashboard/nutritionAiApi";


const HABIT_DETAILS: Record<string, any> = {
  "sleep": {
    title: "Sleep",
    icon: <Bed size={32} className="text-[#3A86FF]" />,
    iconBg: "bg-blue-50/50 border-blue-200",
    status: "ON TRACK",
    statusBg: "bg-teal-100 text-[#0FA4A9]",
    why: "consistent sleep supports physical recovery, neuroplasticity, and emotional stability.",
    target: "7.5-8 Hrs",
    avg: "7.4 Hrs",
    consistency: "71%",
    daysLogged: "5/7",
    logType: "Sleep"
  },
  "nutrition": {
    title: "Nutrition",
    icon: <Apple size={32} className="text-[#0FA4A9]" />,
    iconBg: "bg-[#E6F6F6] border-[#0FA4A9]/30",
    status: "Need Attention",
    statusBg: "bg-pink-100 text-pink-500",
    why: "proper nutrition provides essential macronutrients and micros for sustained energy.",
    target: "2000 Calories",
    avg: "3 Servings",
    consistency: "28%",
    daysLogged: "2/7",
    logType: "Nutrition"
  },
  "activity": {
    title: "Activity",
    icon: <Footprints size={32} className="text-[#3A86FF]" />,
    iconBg: "bg-blue-50/50 border-blue-200",
    status: "ON TRACK",
    statusBg: "bg-teal-100 text-[#0FA4A9]",
    why: "daily movement improves cardiovascular health and boosts cognitive function.",
    target: "8,000 Steps",
    avg: "8,420 Steps",
    consistency: "85%",
    daysLogged: "6/7",
    logType: "Activity"
  },
  "stress": {
    title: "Stress",
    icon: <Frown size={32} className="text-[#A855F7]" />,
    iconBg: "bg-purple-50/50 border-purple-200",
    status: "ON TRACK",
    statusBg: "bg-teal-100 text-[#0FA4A9]",
    why: "managing stress lowers cortisol levels and prevents chronic inflammation.",
    target: "< 5/10",
    avg: "4/10",
    consistency: "57%",
    daysLogged: "4/7",
    logType: "Stress"
  },
  "hydration": {
    title: "Hydration",
    icon: <Droplets size={32} className="text-[#3A86FF]" />,
    iconBg: "bg-blue-50/50 border-blue-200",
    status: "Need Attention",
    statusBg: "bg-pink-100 text-pink-500",
    why: "adequate water intake is crucial for cellular function and metabolism.",
    target: "8 Glasses",
    avg: "4 Glasses",
    consistency: "14%",
    daysLogged: "1/7",
    logType: "Hydration"
  }
};

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = params.habitId as string;
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || currentUser?.user_id;

  const { data: cardData, isLoading: isCardLoading } = useGetCardDataQuery();
  const { data: habitData, isLoading: isHabitLoading } = useGetHabitsQuery(userId, { skip: !userId });

  const { data: sleepReport, isLoading: isSleepLoading } = useGetSleepReportQuery(7, { skip: habitId !== 'sleep' });
  const { data: activityReport, isLoading: isActivityLoading } = useGetActivityReportQuery(7, { skip: habitId !== 'activity' });
  const { data: stressReport, isLoading: isStressLoading } = useGetStressReportQuery(7, { skip: habitId !== 'stress' });
  const { data: hydrationReport, isLoading: isHydrationLoading } = useGetHydrationReportQuery(7, { skip: habitId !== 'hydration' });
  const { data: nutritionReport, isLoading: isNutritionLoading } = useGetNutritionReportQuery(7, { skip: habitId !== 'nutrition' });
  const { data: aiNutritionData } = useGetAiSuggestedTargetQuery(userId, { skip: habitId !== 'nutrition' || !userId });

  const isAnyLoading = isCardLoading || isHabitLoading || isSleepLoading || isActivityLoading || isStressLoading || isHydrationLoading || isNutritionLoading;

  console.log("habitData", habitData);
  console.log("cardData", cardData);

  const [view, setView] = useState<"details" | "logging">("details");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  if (isAnyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="animate-spin text-[#3A86FF]" size={48} />
      </div>
    );
  }

  const habitMetrics = cardData?.data?.consistency_metrics?.find(
    (m: any) => m.title.toLowerCase() === habitId.toLowerCase()
  );

  const insight = habitData?.habits?.[habitId.toLowerCase()];

  // Robust report data mapping
  let reportStats: any = null;
  if (habitId === 'sleep' && sleepReport) {
    const sData = sleepReport.data || sleepReport;
    reportStats = {
      avg: sData.statistics?.average_sleep,
      ratio: sData.statistics?.total_logged,
      target: sData.statistics?.sleep_target,
      consistency: sData.statistics?.consistency
    };
  } else if (habitId === 'activity' && activityReport) {
    const aData = activityReport.data || activityReport;
    reportStats = {
      avg: aData.statistics?.average_steps,
      ratio: aData.statistics?.best_streak ? `${aData.statistics.best_streak}` : undefined,
      target: aData.statistics?.steps_target,
      consistency: aData.statistics?.consistency
    };
  } else if (habitId === 'stress' && stressReport) {
    const strData = stressReport;
    reportStats = {
      avg: strData.stats?.average,
      ratio: strData.stats?.best_streak ? `${strData.stats.best_streak}` : undefined,
      target: undefined, // Update if stress report adds a target
      consistency: strData.stats?.consistency
    };
  } else if (habitId === 'hydration' && hydrationReport) {
    const hData = hydrationReport.data || hydrationReport;
    reportStats = {
      avg: hData.statistics?.average_water,
      ratio: hData.statistics?.best_streak ? `${hData.statistics.best_streak}` : undefined,
      target: hData.statistics?.water_target,
      consistency: hData.statistics?.consistency
    };
  } else if (habitId === 'nutrition' && nutritionReport) {
    const nData = nutritionReport.data || nutritionReport;
    reportStats = {
      avg: nData.statistics?.average,
      ratio: nData.statistics?.best_streak ? `${nData.statistics.best_streak}` : undefined,
      target: undefined,
      consistency: nData.statistics?.consistency
    };
  }

  const habit = {
    ...HABIT_DETAILS[habitId] || HABIT_DETAILS["sleep"],
    ...(habitMetrics ? {
      avg: habitMetrics.avg,
      daysLogged: habitMetrics.ratio,
      status: insight?.status ? insight.status.replace("_", " ").toLowerCase().split(" ").map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") : habitMetrics.status,
      statusBg: (insight?.status ? insight.status === "NEED_ATTENTION" : habitMetrics.status === "Need Attention")
        ? "bg-pink-100 text-pink-500"
        : "bg-teal-100 text-[#0FA4A9]"
    } : {}),
    ...(reportStats ? {
      avg: reportStats.avg || habitMetrics?.avg || (HABIT_DETAILS[habitId] || HABIT_DETAILS["sleep"]).avg,
      daysLogged: reportStats.ratio || habitMetrics?.ratio || (HABIT_DETAILS[habitId] || HABIT_DETAILS["sleep"]).daysLogged,
      consistency: reportStats.consistency || (habitMetrics ? (parseInt(habitMetrics.ratio.split('/')[0]) / 7 * 100).toFixed(0) + '%' : (HABIT_DETAILS[habitId] || HABIT_DETAILS["sleep"]).consistency),
      target: reportStats.target || (HABIT_DETAILS[habitId] || HABIT_DETAILS["sleep"]).target
    } : {}),
    ...(insight ? {
      why: insight.why_this_matters,
      biovueInsights: insight.biovue_insights
    } : {}),
    ...(habitId === 'nutrition' && aiNutritionData?.target_nutrition ? {
      target: `${aiNutritionData.target_nutrition.calories.value} ${aiNutritionData.target_nutrition.calories.unit}`,
      aiTarget: aiNutritionData.target_nutrition,
      isAiSuggestion: true
    } : {
      isAiSuggestion: false
    })
  };

  const handleLogClick = () => {
    if (habitId === 'nutrition' || habitId === 'stress') {
      setView("logging");
    } else {
      setIsLogModalOpen(true);
    }
  };


  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-6 md:p-8 container mx-auto w-full">
      {view === "logging" && habitId === "nutrition" ? (
        <LogNutritionView onBack={() => setView("details")} onSave={() => setView("details")} />
      ) : view === "logging" && habitId === "stress" ? (
        <LogStressView onBack={() => setView("details")} onSave={() => setView("details")} />
      ) : (
        <>
          {/* Top Navigation */}
          <div className="mb-2">
            <button 
              onClick={() => router.push('/user-dashboard/habits')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#3A86FF]/30 text-[#5F6F73] hover:text-[#1F2D2E] hover:bg-blue-50/50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back To Habit
            </button>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-sm font-medium mb-8">
            <span className="text-[#94A3B8]">Habits/</span>
            <span className="text-[#A855F7] capitalize">
              {habitId}
            </span>
          </div>

          {/* Main Container */}
          <div className="bg-white rounded-[16px] p-8 md:p-12 border border-gray-100 shadow-sm">
          
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
              <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center shrink-0", habit.iconBg)}>
                {habit.icon}
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-[#3A86FF] leading-none">{habit.title}</h1>
                <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border w-fit", habit.statusBg, habit.statusBg.split(' ')[0].replace('bg-', 'border-').replace('100', '200'))}>
                  {habit.status}
                </span>
              </div>
            </div>

            <Link href={`/user-dashboard/habits/${habitId}/progress`}>
              <button className="flex items-center gap-2 bg-[#0FA4A9] text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all text-sm cursor-pointer shadow-sm">
                <BarChart2 size={18} />
                View Progress
              </button>
            </Link>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Why it matters & Patterns) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Why This Matters */}
              <div className="bg-[#F8FBFF] rounded-2xl p-8 border border-blue-100/50 flex flex-col gap-3">
                <h3 className="text-[#1F2D2E] font-bold text-sm uppercase tracking-wider">WHY THIS MATTERS</h3>
                <p className="text-[#1F2D2E] italic leading-relaxed text-[15px]">
                  {habit.why}
                </p>
              </div>


              {/* Current Pattern */}
              <div className="border border-gray-50 rounded-[16px] p-10 flex flex-col gap-8 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#1F2D2E] font-bold text-[18px] tracking-wide uppercase">YOUR CURRENT PATTERN</h3>
                  <span className="text-[#1F2D2E] font-bold text-[15px]">{habit.daysLogged} Days Logged</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-[#EAF6F6] rounded-2xl p-8 flex flex-col gap-2">
                    <div className="text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest">WEEKLY AVERAGE</div>
                    <div className="text-[20px] font-bold text-[#1F2D2E] leading-tight">{habit.avg}</div>
                  </div>
                  <div className="bg-[#EAF6F6] rounded-2xl p-8 flex flex-col gap-2">
                    <div className="text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest">CONSISTENCY</div>
                    <div className="text-[28px] font-bold text-[#1F2D2E] leading-none">{habit.consistency}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (Suggested Target & Log Button) */}
            <div className="flex flex-col gap-6">
              
              {/* Suggested Target */}
              <div className="border border-gray-100 rounded-[16px] p-8 flex flex-col items-center justify-center text-center gap-3 bg-white shadow-sm relative overflow-hidden">
                {habit.isAiSuggestion && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-[#3A86FF]/10 text-[#3A86FF] text-[8px] font-bold uppercase tracking-wider rounded-bl-lg">
                    AI POWERED
                  </div>
                )}
                <div className="text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest leading-relaxed">
                  {habit.isAiSuggestion ? "AI SUGGESTED TARGET" : "SUGGESTED TARGET"}
                </div>
                <div className="text-[32px] font-bold text-[#1F2D2E] leading-none my-1">{habit.target}</div>
                
                {/* {habit.isAiSuggestion && habit.aiTarget?.macros && (
                  <div className="grid grid-cols-3 gap-4 w-full mt-4 pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-tight mb-1">PROT</span>
                      <span className="text-[14px] font-bold text-[#1F2D2E]">{habit.aiTarget.macros.protein.value}{habit.aiTarget.macros.protein.unit}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-tight mb-1">CARB</span>
                      <span className="text-[14px] font-bold text-[#1F2D2E]">{habit.aiTarget.macros.carbs.value}{habit.aiTarget.macros.carbs.unit}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-tight mb-1">FAT</span>
                      <span className="text-[14px] font-bold text-[#1F2D2E]">{habit.aiTarget.macros.fat.value}{habit.aiTarget.macros.fat.unit}</span>
                    </div>
                  </div>
                )} */}

                <div className={cn(
                  "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mt-2",
                  habit.isAiSuggestion ? "text-[#3A86FF]" : "text-[#1F2D2E]"
                )}>
                  <div className={cn("w-2.5 h-2.5 rounded-full", habit.isAiSuggestion ? "bg-[#3A86FF] animate-pulse shadow-[0_0_8px_rgba(58,134,255,0.4)]" : "bg-[#10B981]")} />
                  {habit.isAiSuggestion ? "AI SUGGESTS" : "COACH SUGGESTS ADJUSTMENT"}
                </div>
              </div>

              {/* Log Button Box */}
              <div 
                onClick={handleLogClick}
                className="border-2 border-[#3A86FF] rounded-[16px] p-8 flex flex-col items-center justify-center text-center gap-4 bg-white hover:bg-blue-50/30 transition-all cursor-pointer group flex-1 min-h-[240px] shadow-[0_4px_20px_rgba(58,134,255,0.08)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3A86FF] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                  <Plus size={24} className="text-white" />
                </div>
                <span className="text-[#1F2D2E] font-bold text-[17px]">
                  Log Today's {habit.title}
                </span>
              </div>

            </div>
          </div>
        </div>
      </>
      )}

      {habitId === 'nutrition' ? (
        <LogNutritionModal 
          isOpen={isLogModalOpen} 
          onClose={() => setIsLogModalOpen(false)} 
        />
      ) : (
        <LogHabitModal 
          isOpen={isLogModalOpen} 
          onClose={() => setIsLogModalOpen(false)} 
          habitType={habit.logType} 
        />
      )}
    </div>
  );
}
