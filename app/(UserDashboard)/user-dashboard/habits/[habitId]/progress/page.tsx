"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bed,
  Apple,
  Frown,
  Calendar,
  Sparkles,
  User,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import LogHabitModal from "@/components/dashboard/LogHabitModal";
import LogNutritionModal from "@/components/dashboard/LogNutritionModal";
import LogNutritionView from "@/components/dashboard/LogNutritionView";
import LogStressView from "@/components/dashboard/LogStressView";

import { useGetSleepReportQuery } from "@/redux/features/api/userDashboard/sleeplog";
import { useGetNutritionReportQuery } from "@/redux/features/api/userDashboard/nutrition";
import { useGetHydrationReportQuery } from "@/redux/features/api/userDashboard/hydration";
import { useGetActivityReportQuery } from "@/redux/features/api/userDashboard/activitylog";
import { useGetStressReportQuery } from "@/redux/features/api/userDashboard/stresslog";
import { useGetHabitsQuery } from "@/redux/features/api/userDashboard/habit";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { Loader2, Footprints, Activity as ActivityIcon } from "lucide-react";

const MOCK_DATA = [
  { name: "M", val: 0, Protin: 35, Carbs: 45, Fats: 20 },
  { name: "T", val: 0, Protin: 30, Carbs: 50, Fats: 20 },
  { name: "W", val: 0, Protin: 40, Carbs: 40, Fats: 20 },
  { name: "T", val: 0, Protin: 35, Carbs: 45, Fats: 20 },
  { name: "F", val: 0, Protin: 35, Carbs: 45, Fats: 20 },
  { name: "S", val: 0, Protin: 35, Carbs: 45, Fats: 20 },
  { name: "S", val: 0, Protin: 35, Carbs: 45, Fats: 20 },
];

const HABIT_META: Record<string, any> = {
  sleep: {
    title: "Sleep",
    icon: <Bed size={24} className="text-[#3A86FF]" />,
    iconBg: "bg-blue-100/50",
    avgStr: "0 Hrs",
    unit: "Hrs",
    consistency: "0%",
    streak: "0 DAYS",
    trend: "Stable",
    trendColor: "text-[#10B981]",
    insight: "Log your sleep to see insights.",
    coachNote: "Maintaining regular timing will significantly increase your physical recovery markers.",
    coachName: "JORDAN",
    coachTime: "2H AGO",
  },
  nutrition: {
    title: "Nutrition",
    icon: <Apple size={24} className="text-[#0FA4A9]" />,
    iconBg: "bg-[#E6F6F6]",
    avgStr: "0 Servings", 
    consistency: "0%",
    streak: "0 DAYS",
    trend: "Stable",
    trendColor: "text-[#10B981]",
    insight: "Log your nutrition to see insights.",
    coachNote: "Proper nutrition provides essential macronutrients and micros for sustained energy.",
    coachName: "JORDAN",
    coachTime: "2H AGO",
  },
  stress: {
    title: "Stress",
    icon: <Frown size={24} className="text-[#A855F7]" />,
    iconBg: "bg-purple-100",
    avgStr: "0/10 PTS",
    consistency: "0%",
    streak: "0 DAYS",
    trend: "Stable",
    trendColor: "text-[#10B981]",
    insight: "Log your stress levels to see insights.",
    coachNote: "Managing cortisol prevents metabolic interference. Stress oversight is critical for longevity.",
    coachName: "JORDAN",
    coachTime: "2H AGO",
  },
  activity: {
    title: "Activity",
    icon: <Footprints size={24} className="text-[#3A86FF]" />,
    iconBg: "bg-blue-100/50",
    avgStr: "0 Steps",
    unit: "Steps",
    consistency: "0%",
    streak: "0 DAYS",
    trend: "Stable",
    trendColor: "text-[#10B981]",
    insight: "Log your daily steps to see insights.",
    coachNote: "Increasing your daily step count is one of the most effective ways to improve metabolic health.",
    coachName: "JORDAN",
    coachTime: "2H AGO",
  },
  hydration: {
    title: "Hydration",
    icon: <Droplets size={24} className="text-[#3A86FF]" />,
    iconBg: "bg-blue-100/50",
    avgStr: "0 Ounces",
    unit: "Ounces",
    consistency: "0%",
    streak: "0 DAYS",
    trend: "Stable",
    trendColor: "text-[#10B981]",
    insight: "Log your hydration to see insights.",
    coachNote: "Adequate water intake is crucial for cellular function and metabolism.",
    coachName: "JORDAN",
    coachTime: "2H AGO",
  },
};

export default function HabitProgressPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = params.habitId as string;
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || currentUser?.user_id;
  
  const [view, setView] = useState<"trends" | "logging">("trends");
  const [timeframe, setTimeframe] = useState("Weekly");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const { data: habitData, isLoading: isHabitLoading } = useGetHabitsQuery(userId, { skip: !userId });

  const timeframeToDays = (tf: string) => {
    switch (tf) {
      case "Weekly": return 7;
      case "Monthly": return 30;
      case "Last 3 months": return 90;
      default: return 7;
    }
  };

  const days = timeframeToDays(timeframe);
  
  const { data: sleepReport, isLoading: isSleepLoading } = useGetSleepReportQuery(days, {
    skip: habitId !== 'sleep'
  });

  const { data: nutritionReport, isLoading: isNutritionLoading } = useGetNutritionReportQuery(days, {
    skip: habitId !== 'nutrition'
  });

  const { data: activityReport, isLoading: isActivityLoading } = useGetActivityReportQuery(days, {
    skip: habitId !== 'activity'
  });

  const { data: hydrationReport, isLoading: isHydrationLoading } = useGetHydrationReportQuery(days, {
    skip: habitId !== 'hydration'
  });

  const { data: stressReport, isLoading: isStressLoading } = useGetStressReportQuery(days, {
    skip: habitId !== 'stress'
  });

  const sleepData = sleepReport?.data || sleepReport;
  const activityData = activityReport?.data || activityReport;
  const stressData = stressReport; // Stress API returns success/period/chart_data/stats at top level

  const habit = habitId === 'sleep' && sleepData?.statistics ? {
    title: "Sleep",
    icon: <Bed size={24} className="text-[#3A86FF]" />,
    iconBg: "bg-blue-100/50",
    avgStr: sleepData.statistics.average_sleep || "0 Hrs",
    unit: "Hrs",
    consistency: sleepData.statistics.consistency || "0%",
    streak: sleepData.statistics.total_logged || "0 / 7 Days",
    trend: sleepData.statistics.current_trend || "Stable",
    trendColor: "text-[#10B981]",
    insight: sleepData.bio_insight || "Your sleep quality supports physical recovery and mental clarity.",
    coachNote: sleepData.bio_insight || "Maintaining regular timing will significantly increase your physical recovery markers.",
    coachName: "JORDAN",
    coachTime: "2H AGO",
  } : habitId === 'activity' && activityData?.statistics ? {
    title: "Activity",
    icon: <Footprints size={24} className="text-[#3A86FF]" />,
    iconBg: "bg-blue-100/50",
    avgStr: activityData.statistics.average_steps || "0 Steps",
    unit: "Steps",
    consistency: activityData.statistics.consistency || "0%",
    streak: activityData.statistics.best_streak || "0 DAYS",
    trend: activityData.statistics.current_trend || "Stable",
    trendColor: "text-[#10B981]",
    insight: activityData.bio_insight || "Daily movement improves cardiovascular health and boosts cognitive function.",
    coachNote: activityData.bio_insight || "Increasing your daily step count is one of the most effective ways to improve metabolic health.",
    coachName: "JORDAN",
    coachTime: "2H AGO",
  } : habitId === 'nutrition' && nutritionReport?.data ? {
    title: "Nutrition",
    icon: <Apple size={24} className="text-[#0FA4A9]" />,
    iconBg: "bg-[#E6F6F6]",
    avgStr: nutritionReport.data.statistics.average,
    unit: "",
    consistency: nutritionReport.data.statistics.consistency,
    streak: nutritionReport.data.statistics.best_streak,
    trend: nutritionReport.data.statistics.current_trend,
    trendColor: "text-[#10B981]",
    insight: nutritionReport.data.bio_insight,
    coachNote: nutritionReport.data.bio_insight,
    coachName: "JORDAN",
    coachTime: "2H AGO",
  } : habitId === 'hydration' && hydrationReport?.hydration ? {
    title: "Hydration",
    icon: <Droplets size={24} className="text-[#3A86FF]" />,
    iconBg: "bg-blue-100/50",
    avgStr: hydrationReport.hydration.average || "0 Ounces",
    unit: "Ounces",
    consistency: hydrationReport.hydration.consistency || "0%",
    streak: hydrationReport.hydration.best_streak || "0 DAYS",
    trend: hydrationReport.hydration.current_trend || "Stable",
    trendColor: "text-[#10B981]",
    insight: hydrationReport.hydration.bio_insight || "Your hydration levels are tracked based on your daily water intake.",
    coachNote: hydrationReport.hydration.coach_note || hydrationReport.hydration.bio_insight || "Adequate water intake is crucial for cellular function and metabolism.",
    coachName: "JORDAN",
    coachTime: "2H AGO",
  } : habitId === 'stress' && stressData?.stats ? {
    title: "Stress",
    icon: <Frown size={24} className="text-[#A855F7]" />,
    iconBg: "bg-purple-100",
    avgStr: stressData.stats.average || "0/10 PTS",
    unit: "PTS",
    consistency: stressData.stats.consistency || "0%",
    streak: stressData.stats.best_streak || "0 DAYS",
    trend: stressData.stats.current_trend || "Stable",
    trendColor: "text-[#10B981]",
    insight: stressData.bio_insight || "Managing cortisol prevents metabolic interference. Stress oversight is critical for longevity.",
    coachNote: stressData.bio_insight || "Managing cortisol prevents metabolic interference. Stress oversight is critical for longevity.",
    coachName: "JORDAN",
    coachTime: "2H AGO",
  } : (HABIT_META[habitId] || HABIT_META["sleep"]);

  const chartData = habitId === 'sleep' && sleepData?.chart_data ? 
    sleepData.chart_data.map((item: any) => ({
      name: item.label, // Mon, Tue etc.
      date: item.date,  // 02 Mar etc.
      val: item.sleep_hours || 0,
    })) : habitId === 'activity' && activityData?.chart_data ?
      activityData.chart_data.map((item: any) => ({
      name: item.label,
      val: item.steps || 0,
    })) : habitId === 'nutrition' && nutritionReport?.data?.chart_data ? 
      nutritionReport.data.chart_data.map((item: any) => ({
        name: item.label,
        Protin: item.protein,
        Carbs: item.carbs,
        Fats: item.fats
      })) : habitId === 'hydration' && hydrationReport?.hydration?.chart ? 
        Object.entries(hydrationReport.hydration.chart).map(([label, value]) => ({
      name: label,
      val: value || 0
    })) : habitId === 'stress' && stressData?.chart_data ?
      stressData.chart_data.map((item: any) => ({
        name: item.day,
        date: item.date,
        val: item.stress_level || 0,
        mood: item.mood
      })) : MOCK_DATA;


  const handleLogClick = () => {
    if (habitId === "stress") {
      setView("logging");
    } else {
      setIsLogModalOpen(true);
    }
  }

  if (isSleepLoading || isNutritionLoading || isHydrationLoading || isActivityLoading || isStressLoading || isHabitLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="animate-spin text-[#3A86FF]" size={48} />
      </div>
    );
  }

  const hData = habitData?.data || habitData;
  const habitKey = habitId.toLowerCase();
  
  // Robust mapping for insights (handles nested and flat structures)
  const biovueInsight = 
    hData?.habits?.[habitKey]?.biovue_insights || 
    hData?.habits?.[habitKey]?.insights || 
    hData?.[`${habitKey}_biovue_insights`] || 
    hData?.[`${habitKey}_insights`] || 
    hData?.biovue_insights || 
    hData?.insights;

  const whyThisMatters = 
    hData?.habits?.[habitKey]?.why_this_matters || 
    hData?.[`${habitKey}_why_this_matters`] || 
    hData?.why_this_matters;

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-6 md:p-8 container mx-auto w-full">
      {view === "logging" && habitId === "nutrition" ? (
        <LogNutritionView
          onBack={() => setView("trends")}
          onSave={() => setView("trends")}
        />
      ) : view === "logging" && habitId === "stress" ? (
        <LogStressView
          onBack={() => setView("trends")}
          onSave={() => setView("trends")}
        />
      ) : (
        <>
          {/* Top Navigation */}
          <div className="mb-2">
            <button
              onClick={() => router.push(`/user-dashboard/habits/${habitId}`)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#3A86FF]/30 text-[#5F6F73] hover:text-[#1F2D2E] hover:bg-blue-50/50 rounded-lg text-xs font-semibold transition-all cursor-pointer w-fit"
            >
              <ArrowLeft size={14} />
              Back To Habit
            </button>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-sm font-medium mb-8">
            <span className="text-[#94A3B8]">Habits/</span>
            <span className="text-[#A855F7] capitalize">
              {habitId}/ progress
            </span>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {/* Main Chart Card */}
            <div className="bg-white rounded-[24px] p-8 md:p-10 border border-[#EDF2F7] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-8 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-[12px] flex items-center justify-center shrink-0 bg-[#EAF1FF]",
                    )}
                  >
                    {habitId === 'sleep' ? <Bed size={32} className="text-[#3A86FF]" /> : habit.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold text-[#3A86FF]">
                      {habitId === 'sleep' ? "Sleep Progress" : `${habit.title} Trends`}
                    </h2>
                    <p className="text-[#94A3B8] text-sm font-medium italic">
                      {habitId === 'sleep' ? "Based on your logged sleep data" : `Based on your logged ${habitId === 'nutrition' ? 'meals and nutrition quality' : 'data'}`}
                    </p>
                  </div>
                </div>

                <div className="flex p-1.5 bg-white border border-[#E2E8F0] rounded-[12px] overflow-hidden self-start md:self-auto shrink-0">
                  {["Weekly", "Monthly", "Last 3 months"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={cn(
                        "px-5 py-2 text-sm font-semibold rounded-[8px] transition-all cursor-pointer",
                        t === timeframe
                          ? "bg-[#D9E6FF] text-[#1F2D2E]"
                          : "text-[#5F6F73] hover:bg-gray-50",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-80 w-full mt-4 -ml-4 pr-4">
                <ResponsiveContainer width="100%" height="100%">
                  {habitId === "nutrition" ? (
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F1F5F9"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 14,
                          fill: "#94A3B8",
                          fontWeight: 500,
                        }}
                        dy={15}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "#94A3B8",
                          fontWeight: 500,
                        }}
                        tickFormatter={(val) => `${val}%`}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(val) => (
                          <span className="text-gray-400 font-medium text-xs ml-1 mr-4">
                            {val}
                          </span>
                        )}
                      />
                      <Bar
                        dataKey="Protin"
                        stackId="a"
                        fill="#3AAB67"
                        barSize={12}
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="Carbs"
                        stackId="a"
                        fill="#60A5FA"
                        barSize={12}
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="Fats"
                        stackId="a"
                        fill="#FB923C"
                        barSize={12}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  ) : (
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 30, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorGreen"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4ade80"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4ade80"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="0"
                        vertical={false}
                        stroke="#F8FAFC"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 14,
                          fill: "#94A3B8",
                          fontWeight: 500,
                        }}
                        dy={15}
                      />
                      <YAxis
                        hide
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                        }}
                        labelStyle={{ fontWeight: 600, color: "#1F2D2E" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke="#4ade80"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorGreen)"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-3">
                <span className="text-[#3A86FF] font-bold text-[13px] uppercase tracking-widest">
                  AVERAGE
                </span>
                <span className="text-[20px] font-bold text-[#1F2D2E]">
                  {habit.avgStr}
                </span>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-3">
                <span className="text-[#3A86FF] font-bold text-[13px] uppercase tracking-widest">
                  CONSISTENCY
                </span>
                <span className="text-[20px] font-bold text-[#1F2D2E]">
                  {habit.consistency}
                </span>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-3">
                <span className="text-[#3A86FF] font-bold text-[13px] uppercase tracking-widest">
                  BEST STREAK
                </span>
                <span className="text-[20px] font-bold text-[#1F2D2E]">
                  {habit.streak}
                </span>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-3">
                <span className="text-[#3A86FF] font-bold text-[13px] uppercase tracking-widest">
                  CURRENT TREND
                </span>
                <span className={cn("text-[20px] font-bold", habit.trendColor)}>
                  {habit.trend}
                </span>
              </div>
            </div>

        

            {/* BIOVUE Insight */}
            <div className="bg-[#EAF6F6] rounded-4xl p-6 md:p-8 border border-teal-100 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#0FA4A9] font-bold text-sm tracking-widest uppercase">
                <ActivityIcon size={18} />
                BIOVUE INSIGHT
              </div>
              <p className="text-[#1F2D2E] italic">{biovueInsight || habit.insight}</p>
            </div>

            {/* Coach Note */}
            <div className="bg-[#F5F3FF] rounded-4xl p-6 md:p-8 border border-purple-100 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <User size={20} />
                </div>
                <h3 className="text-[#8B5CF6] font-bold text-[17px]">
                  Coach Note
                </h3>
              </div>
              <p className="text-[#1F2D2E] italic text-[15px] leading-relaxed">
                {habit.coachNote}
              </p>
              <span className="text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest italic mt-1">
                {habit.coachName}. {habit.coachTime}
              </span>
            </div>

            {/* Sticky-like Footer Button */}
            <div className="mt-8 mb-4">
              <button
                onClick={handleLogClick}
                className="w-full bg-[#0FA4A9] text-white py-4 rounded-xl font-bold text-[17px] hover:bg-opacity-90 transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20 flex items-center justify-center gap-2 group"
              >
                <Calendar size={20} />
                Log Today&apos;s {habit.title}
              </button>
            </div>
          </div>
        </>
      )}

      {habitId === "nutrition" ? (
        <LogNutritionModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
        />
      ) : (
        <LogHabitModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          habitType={habit.title}
        />
      )}
    </div>
  );
}

