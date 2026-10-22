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
  Cell,
  ReferenceLine,
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
import { useGetHabitsQuery as _unused } from "@/redux/features/api/userDashboard/habit";
import { useGetAiSavedHabitsQuery } from "@/redux/features/api/userDashboard/Projection/AIHabitsAPI";
import { useGetAiSuggestedTargetQuery } from "@/redux/features/api/userDashboard/nutritionAiApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { Loader2, Footprints, Activity as ActivityIcon } from "lucide-react";

const MOCK_DATA = [
  { name: "M", val: 0, Protein: 35, Carbs: 45, Fats: 20 },
  { name: "T", val: 0, Protein: 30, Carbs: 50, Fats: 20 },
  { name: "W", val: 0, Protein: 40, Carbs: 40, Fats: 20 },
  { name: "T", val: 0, Protein: 35, Carbs: 45, Fats: 20 },
  { name: "F", val: 0, Protein: 35, Carbs: 45, Fats: 20 },
  { name: "S", val: 0, Protein: 35, Carbs: 45, Fats: 20 },
  { name: "S", val: 0, Protein: 35, Carbs: 45, Fats: 20 },
];

const NUTRITION_MOCK_DATA = [
  { name: "Mon", date: "Mon", val: 85, calories: 1700, target: 2000, Protein: 120, Carbs: 180, Fats: 55 },
  { name: "Tue", date: "Tue", val: 100, calories: 2000, target: 2000, Protein: 140, Carbs: 210, Fats: 65 },
  { name: "Wed", date: "Wed", val: 50, calories: 1000, target: 2000, Protein: 70, Carbs: 110, Fats: 30 },
  { name: "Thu", date: "Thu", val: 95, calories: 1900, target: 2000, Protein: 130, Carbs: 200, Fats: 60 },
  { name: "Fri", date: "Fri", val: 130, calories: 2600, target: 2000, Protein: 175, Carbs: 280, Fats: 85 },
  { name: "Sat", date: "Sat", val: 115, calories: 2300, target: 2000, Protein: 155, Carbs: 240, Fats: 75 },
  { name: "Sun", date: "Sun", val: 110, calories: 2200, target: 2000, Protein: 145, Carbs: 230, Fats: 70 },
];

const calculateNutritionChartItem = (
  item: any,
  userCalorieTarget: number,
  macroTargets?: { protein: number; carbs: number; fat: number }
) => {
  const rawTarget = Number(item.target || item.target_calories || userCalorieTarget || 2000);
  let rawProtein = Number(item.protein ?? item.Protin ?? item.Protein ?? item.p ?? 0);
  let rawCarbs = Number(item.carbs ?? item.Carbs ?? item.c ?? 0);
  let rawFats = Number(item.fats ?? item.Fats ?? item.fat ?? item.f ?? 0);

  let rawCalories = item.calories !== undefined && item.calories !== null
    ? Number(item.calories)
    : item.total_calories !== undefined && item.total_calories !== null
    ? Number(item.total_calories)
    : (rawProtein * 4) + (rawCarbs * 4) + (rawFats * 9);

  if (rawCalories === 0 && item.val !== undefined && item.val !== null) {
    rawCalories = Number(item.val);
  }

  // If macros are not logged individually, estimate them from calories based on targets
  if (rawProtein === 0 && rawCarbs === 0 && rawFats === 0 && rawCalories > 0) {
    if (macroTargets && (macroTargets.protein > 0 || macroTargets.carbs > 0 || macroTargets.fat > 0)) {
      const targetCals = (macroTargets.protein * 4) + (macroTargets.carbs * 4) + (macroTargets.fat * 9);
      if (targetCals > 0) {
        rawProtein = Math.round((rawCalories * ((macroTargets.protein * 4) / targetCals)) / 4);
        rawCarbs = Math.round((rawCalories * ((macroTargets.carbs * 4) / targetCals)) / 4);
        rawFats = Math.round((rawCalories * ((macroTargets.fat * 9) / targetCals)) / 9);
      }
    } else {
      rawProtein = Math.round((rawCalories * 0.3) / 4);
      rawCarbs = Math.round((rawCalories * 0.5) / 4);
      rawFats = Math.round((rawCalories * 0.2) / 9);
    }
  }

  const proteinCals = rawProtein * 4;
  const carbsCals = rawCarbs * 4;
  const fatsCals = rawFats * 9;
  const sumCals = proteinCals + carbsCals + fatsCals;
  const effectiveCalories = rawCalories > 0 ? rawCalories : sumCals;

  const calculatedPercentage = item.percentage !== undefined
    ? Number(item.percentage)
    : item.adherence !== undefined
    ? Number(item.adherence)
    : rawTarget > 0
    ? Math.round((effectiveCalories / rawTarget) * 100)
    : 0;

  // Determine the macro share ratios
  let ratioP = 0.3;
  let ratioC = 0.5;
  let ratioF = 0.2;

  if (sumCals > 0) {
    ratioP = proteinCals / sumCals;
    ratioC = carbsCals / sumCals;
    ratioF = fatsCals / sumCals;
  } else if (macroTargets && (macroTargets.protein > 0 || macroTargets.carbs > 0 || macroTargets.fat > 0)) {
    const targetCals = (macroTargets.protein * 4) + (macroTargets.carbs * 4) + (macroTargets.fat * 9);
    if (targetCals > 0) {
      ratioP = (macroTargets.protein * 4) / targetCals;
      ratioC = (macroTargets.carbs * 4) / targetCals;
      ratioF = (macroTargets.fat * 9) / targetCals;
    }
  }

  // Base portion (up to 100%) is filled with the 3 macros proportionally
  const basePct = Math.min(calculatedPercentage, 100);
  const proteinPct = Math.round(basePct * ratioP * 10) / 10;
  const carbsPct = Math.round(basePct * ratioC * 10) / 10;
  const fatsPct = Math.max(0, Math.round((basePct - proteinPct - carbsPct) * 10) / 10);
  // Any portion above 100% is displayed as overage (red bar segment)
  const overagePct = calculatedPercentage > 100 ? Math.round((calculatedPercentage - 100) * 10) / 10 : 0;

  return {
    name: item.label || item.day || item.name || item.date,
    date: item.date || item.label,
    val: calculatedPercentage,
    calories: Math.round(effectiveCalories),
    target: rawTarget,
    Protein: Math.round(rawProtein),
    Carbs: Math.round(rawCarbs),
    Fats: Math.round(rawFats),
    ProteinPct: proteinPct,
    CarbsPct: carbsPct,
    FatsPct: fatsPct,
    OveragePct: overagePct,
  };
};

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
    coachNote: "",
    coachName: "",
    coachTime: "",
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
    coachNote: "",
    coachName: "",
    coachTime: "",
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
    coachNote: "",
    coachName: "",
    coachTime: "",
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
    coachNote: "",
    coachName: "",
    coachTime: "",
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
    coachNote: "",
    coachName: "",
    coachTime: "",
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

  const { data: habitData, isLoading: isHabitLoading } = useGetAiSavedHabitsQuery(userId, { skip: !userId });

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

  const { data: aiNutritionData } = useGetAiSuggestedTargetQuery(userId, {
    skip: habitId !== 'nutrition' || !userId,
  });

  const userCalorieTarget = Number(
    aiNutritionData?.target_nutrition?.calories?.value ||
    nutritionReport?.statistics?.target_calories ||
    nutritionReport?.data?.statistics?.target_calories ||
    2000
  );

  const macroTargets = {
    protein: Number(
      aiNutritionData?.target_nutrition?.macros?.protein?.value ||
      nutritionReport?.statistics?.target_protein ||
      nutritionReport?.data?.statistics?.target_protein ||
      Math.round((userCalorieTarget * 0.3) / 4)
    ),
    carbs: Number(
      aiNutritionData?.target_nutrition?.macros?.carbs?.value ||
      nutritionReport?.statistics?.target_carbs ||
      nutritionReport?.data?.statistics?.target_carbs ||
      Math.round((userCalorieTarget * 0.5) / 4)
    ),
    fat: Number(
      aiNutritionData?.target_nutrition?.macros?.fat?.value ||
      nutritionReport?.statistics?.target_fat ||
      nutritionReport?.data?.statistics?.target_fat ||
      Math.round((userCalorieTarget * 0.2) / 9)
    ),
  };

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

  // Helper to safely extract profession_notes without throwing errors
  const getCoachData = (reportObj: any) => {
    try {
      if (!reportObj) return { coachNote: "", coachName: "", coachTime: "" };
      
      // Safely access profession_notes wherever it might be nested
      const notes = reportObj?.data?.profession_notes 
        || reportObj?.profession_notes 
        || reportObj?.hydration?.profession_notes 
        || reportObj?.stats?.profession_notes 
        || [];
      
      if (Array.isArray(notes) && notes.length > 0) {
        const note = notes[0];
        if (!note || typeof note !== 'object') return { coachNote: "", coachName: "", coachTime: "" };

        let timeStr = "";
        if (note.created_at) {
          const d = new Date(note.created_at);
          if (!isNaN(d.getTime())) {
            timeStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
          }
        }

        return {
          coachNote: typeof note.note === 'string' ? note.note : "",
          coachName: typeof note.provider_name === 'string' ? note.provider_name : "",
          coachTime: timeStr,
        };
      }
    } catch (error) {
      console.error("Error parsing coach notes:", error);
    }
    return { coachNote: "", coachName: "", coachTime: "" };
  };

  const sleepCoach = getCoachData(sleepData);
  const activityCoach = getCoachData(activityData);
  const nutritionCoach = getCoachData(nutritionReport);
  const hydrationCoach = getCoachData(hydrationReport);
  const stressCoach = getCoachData(stressData);

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
    coachNote: sleepCoach.coachNote,
    coachName: sleepCoach.coachName,
    coachTime: sleepCoach.coachTime,
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
    coachNote: activityCoach.coachNote,
    coachName: activityCoach.coachName,
    coachTime: activityCoach.coachTime,
  } : habitId === 'nutrition' && (nutritionReport?.data || nutritionReport?.statistics) ? {
    title: "Nutrition",
    icon: <Apple size={24} className="text-[#0FA4A9]" />,
    iconBg: "bg-[#E6F6F6]",
    avgStr: nutritionReport?.data?.statistics?.average || nutritionReport?.statistics?.average || "0 kcal",
    unit: "",
    consistency: nutritionReport?.data?.statistics?.consistency || nutritionReport?.statistics?.consistency || "0%",
    streak: nutritionReport?.data?.statistics?.best_streak || nutritionReport?.statistics?.best_streak || "0",
    trend: nutritionReport?.data?.statistics?.current_trend || nutritionReport?.statistics?.current_trend || "Stable",
    trendColor: "text-[#10B981]",
    insight: nutritionReport?.data?.bio_insight || nutritionReport?.bio_insight,
    coachNote: nutritionCoach.coachNote,
    coachName: nutritionCoach.coachName,
    coachTime: nutritionCoach.coachTime,
  } : habitId === 'hydration' && (hydrationReport?.hydration || hydrationReport?.data) ? {
    title: "Hydration",
    icon: <Droplets size={24} className="text-[#3A86FF]" />,
    iconBg: "bg-blue-100/50",
    avgStr: hydrationReport?.hydration?.average || hydrationReport?.data?.statistics?.average_water || "0 Ounces",
    unit: "Ounces",
    consistency: hydrationReport?.hydration?.consistency || hydrationReport?.data?.statistics?.consistency || "0%",
    streak: hydrationReport?.hydration?.best_streak || hydrationReport?.data?.statistics?.best_streak || "0 DAYS",
    trend: hydrationReport?.hydration?.current_trend || hydrationReport?.data?.statistics?.current_trend || "Stable",
    trendColor: "text-[#10B981]",
    insight: hydrationReport?.hydration?.bio_insight || hydrationReport?.data?.bio_insight || "Your hydration levels are tracked based on your daily water intake.",
    coachNote: hydrationCoach.coachNote,
    coachName: hydrationCoach.coachName,
    coachTime: hydrationCoach.coachTime,
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
    coachNote: stressCoach.coachNote,
    coachName: stressCoach.coachName,
    coachTime: stressCoach.coachTime,
  } : (HABIT_META[habitId] || HABIT_META["sleep"]);

  // Final cleanup for units from API based on habit type
  if (habitId === 'hydration') {
    if (typeof habit.avgStr === 'string') {
      habit.avgStr = habit.avgStr.replace(/glasses|gls/gi, "Ounces");
    }
  } else if (habitId === 'nutrition') {
    if (typeof habit.avgStr === 'string') {
      habit.avgStr = habit.avgStr.replace(/glasses|gls/gi, "kcal").replace(/kcal\s+kcal/gi, "kcal").trim();
      if (habit.avgStr === "0" || habit.avgStr === "0 kcal") {
        habit.avgStr = "0 kcal";
      }
    }
  }

  const nutritionRawChart =
    nutritionReport?.data?.chart_data ||
    nutritionReport?.chart_data ||
    nutritionReport?.data?.statistics?.chart_data;

  const chartData = habitId === 'sleep' && Array.isArray(sleepData?.chart_data) ?
    sleepData.chart_data.map((item: any) => ({
      name: item.label, // Mon, Tue etc.
      date: item.date,  // 02 Mar etc.
      val: item.sleep_hours || 0,
    })) : habitId === 'activity' && Array.isArray(activityData?.chart_data) ?
      activityData.chart_data.map((item: any) => ({
        name: item.label,
        val: item.steps || 0,
      })) : habitId === 'nutrition' ?
        (Array.isArray(nutritionRawChart) && nutritionRawChart.length > 0
          ? nutritionRawChart.map((item: any) =>
              calculateNutritionChartItem(item, userCalorieTarget, macroTargets)
            )
          : NUTRITION_MOCK_DATA.map((item: any) =>
              calculateNutritionChartItem(item, userCalorieTarget, macroTargets)
            )
        ) : habitId === 'hydration' && (hydrationReport?.hydration?.chart || hydrationReport?.hydration?.chart_data || hydrationReport?.chart_data || hydrationReport?.data?.chart_data) ?
          (() => {
            const rawChart = hydrationReport?.hydration?.chart || hydrationReport?.hydration?.chart_data || hydrationReport?.chart_data || hydrationReport?.data?.chart_data;
            if (Array.isArray(rawChart)) {
              return rawChart.map((item: any) => ({
                name: item.label || item.name || item.date || item.day,
                val: Number(item.val || item.value || item.ounces || item.Ounces || item.glasses || 0)
              }));
            }
            return Object.entries(rawChart || {}).map(([label, value]) => ({
              name: label,
              val: Number(value || 0)
            }));
          })() : habitId === 'stress' && Array.isArray(stressData?.chart_data) ?
            stressData.chart_data.map((item: any) => ({
              name: item.day,
              date: item.date,
              val: item.stress_level || 0,
              mood: item.mood
            })) : MOCK_DATA;

  // Dynamic nutrition average calculation if backend statistics is not populated yet
  if (habitId === 'nutrition' && habit) {
    let dynamicNutritionAvg = nutritionReport?.data?.statistics?.average || nutritionReport?.statistics?.average;
    if (!dynamicNutritionAvg || dynamicNutritionAvg === "0 kcal" || dynamicNutritionAvg === "0") {
      if (Array.isArray(chartData) && chartData.length > 0) {
        const loggedDays = chartData.filter((d: any) => (d.calories || 0) > 0);
        if (loggedDays.length > 0) {
          const totalCals = loggedDays.reduce((acc: number, d: any) => acc + (d.calories || 0), 0);
          habit.avgStr = `${Math.round(totalCals / loggedDays.length)} kcal`;
        }
      }
    }
  }

  const handleLogClick = () => {
    if (habitId === "stress" || habitId === "nutrition") {
      setView("logging");
    } else {
      setIsLogModalOpen(true);
    }
  };

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
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-2 sm:p-4 md:p-6 w-full max-w-7xl mx-auto min-w-0">
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
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-[#3A86FF]/30 text-[#5F6F73] hover:text-[#1F2D2E] hover:bg-blue-50/50 rounded-lg text-xs font-semibold transition-all cursor-pointer w-fit"
            >
              <ArrowLeft size={14} />
              Back To Habit
            </button>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-xs sm:text-sm font-medium mb-3 sm:mb-6">
            <span className="text-[#94A3B8]">Habits/</span>
            <span className="text-[#A855F7] capitalize">
              {habitId}/ progress
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 w-full min-w-0">
            {/* Main Chart Card */}
            <div className="bg-white rounded-2xl md:rounded-[24px] p-4 sm:p-5 md:p-6 lg:p-8 border border-[#EDF2F7] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-5 sm:gap-6 w-full min-w-0 overflow-hidden">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full min-w-0">
                <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                  <div
                    className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-[12px] flex items-center justify-center shrink-0 bg-[#EAF1FF]",
                    )}
                  >
                    <div className="[&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-7 sm:[&>svg]:h-7 md:[&>svg]:w-8 md:[&>svg]:h-8 flex items-center justify-center">
                      {habitId === 'sleep' ? <Bed size={32} className="text-[#3A86FF]" /> : habit.icon}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3A86FF] truncate">
                      {habitId === 'sleep' ? "Sleep Progress" : `${habit.title} Trends`}
                    </h2>
                    <p className="text-[#94A3B8] text-xs sm:text-sm font-medium italic truncate">
                      {habitId === 'sleep' ? "Based on your logged sleep data" : `Based on your logged ${habitId === 'nutrition' ? 'meals and nutrition quality' : 'data'}`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 self-start xl:self-auto shrink-0">
                  {habitId === "nutrition" && (
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {/* Protein Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-[#EBF7EE] text-[#1E7E34] border border-[#C3E6CB] shadow-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3AAB67] shrink-0" />
                        <span>Protein</span>
                        <span className="font-bold text-[#155724] ml-0.5">{macroTargets.protein}g</span>
                      </div>
                      {/* Carbs Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] shadow-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA] shrink-0" />
                        <span>Carbs</span>
                        <span className="font-bold text-[#1E40AF] ml-0.5">{macroTargets.carbs}g</span>
                      </div>
                      {/* Fat Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] shadow-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C] shrink-0" />
                        <span>Fat</span>
                        <span className="font-bold text-[#9A3412] ml-0.5">{macroTargets.fat}g</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 p-1 bg-white border border-[#E2E8F0] rounded-xl self-start sm:self-auto shrink-0 w-full sm:w-auto overflow-x-auto">
                    {["Weekly", "Monthly", "Last 3 months"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={cn(
                          "flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer text-center whitespace-nowrap shrink-0",
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
              </div>

              <div className="h-72 sm:h-80 md:h-88 w-full min-w-0 mt-2 sm:mt-4">
                {habitId === "nutrition" ? (
                  <div className="h-full w-full flex flex-col">
                    <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
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
                              fontSize: 13,
                              fill: "#94A3B8",
                              fontWeight: 600,
                            }}
                            dy={8}
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
                            domain={[
                              0,
                              (dataMax: number) =>
                                Math.max(140, Math.ceil((dataMax + 15) / 20) * 20),
                            ]}
                          />
                          <ReferenceLine
                            y={100}
                            stroke="#10B981"
                            strokeDasharray="4 4"
                            strokeWidth={1.5}
                            label={{
                              value: "100% Target",
                              position: "insideTopRight",
                              fill: "#10B981",
                              fontSize: 11,
                              fontWeight: "bold",
                            }}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                            content={({ active, payload }) => {
                              if (!active || !payload || !payload.length) return null;
                              const data = payload[0].payload;
                              const isOver = (data.val || 0) > 100;
                              return (
                                <div className="bg-white p-3.5 rounded-xl shadow-xl border border-gray-100 text-xs flex flex-col gap-2 min-w-[200px]">
                                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 gap-2">
                                    <span className="font-bold text-[#1F2D2E]">
                                      {data.name} {data.date && data.date !== data.name ? `(${data.date})` : ""}
                                    </span>
                                    <span
                                      className={cn(
                                        "font-bold px-2 py-0.5 rounded-full text-[10px]",
                                        isOver
                                          ? "bg-red-50 text-red-600 border border-red-200"
                                          : "bg-teal-50 text-[#0FA4A9] border border-teal-200",
                                      )}
                                    >
                                      {data.val}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-gray-600">
                                    <span>Calories:</span>
                                    <span className="font-bold text-[#1F2D2E]">
                                      {data.calories ? `${data.calories}` : `${data.val}%`}
                                      {data.target ? ` / ${data.target} kcal` : " kcal"}
                                    </span>
                                  </div>
                                  {isOver && (
                                    <div className="text-red-500 font-semibold text-[11px] bg-red-50/50 p-1 rounded">
                                      +{Math.round(data.val - 100)}% over daily calorie target
                                    </div>
                                  )}
                                  <div className="pt-2 border-t border-gray-100 space-y-1.5">
                                    <div className="flex justify-between items-center text-[11px]">
                                      <span className="flex items-center gap-1.5 text-gray-600">
                                        <span className="w-2 h-2 rounded-full bg-[#3AAB67]" />
                                        Protein:
                                      </span>
                                      <span className="font-bold text-gray-800">{data.Protein}g ({data.ProteinPct}%)</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px]">
                                      <span className="flex items-center gap-1.5 text-gray-600">
                                        <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
                                        Carbs:
                                      </span>
                                      <span className="font-bold text-gray-800">{data.Carbs}g ({data.CarbsPct}%)</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px]">
                                      <span className="flex items-center gap-1.5 text-gray-600">
                                        <span className="w-2 h-2 rounded-full bg-[#FB923C]" />
                                        Fat:
                                      </span>
                                      <span className="font-bold text-gray-800">{data.Fats}g ({data.FatsPct}%)</span>
                                    </div>
                                    {data.OveragePct > 0 && (
                                      <div className="flex justify-between items-center text-[11px]">
                                        <span className="flex items-center gap-1.5 text-red-600">
                                          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                                          Over Target:
                                        </span>
                                        <span className="font-bold text-red-600">+{data.OveragePct}%</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Bar
                            dataKey="ProteinPct"
                            name="Protein"
                            stackId="a"
                            fill="#3AAB67"
                            barSize={20}
                            radius={[0, 0, 0, 0]}
                            animationDuration={1000}
                          />
                          <Bar
                            dataKey="CarbsPct"
                            name="Carbs"
                            stackId="a"
                            fill="#60A5FA"
                            barSize={20}
                            radius={[0, 0, 0, 0]}
                            animationDuration={1000}
                          />
                          <Bar
                            dataKey="FatsPct"
                            name="Fat"
                            stackId="a"
                            fill="#FB923C"
                            barSize={20}
                            radius={[3, 3, 0, 0]}
                            animationDuration={1000}
                          />
                          <Bar
                            dataKey="OveragePct"
                            name="Over Target"
                            stackId="a"
                            fill="#EF4444"
                            barSize={20}
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 text-xs font-semibold shrink-0 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3AAB67]" />
                        <span className="text-[#5F6F73]">Protein</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]" />
                        <span className="text-[#5F6F73]">Carbs</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C]" />
                        <span className="text-[#5F6F73]">Fat</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                        <span className="text-[#5F6F73]">Over Target (&gt; 100%)</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#10B981]" />
                        <span className="text-[#10B981]">100% Target Goal</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
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
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 w-full min-w-0">
              <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col gap-1.5 min-w-0">
                <span className="text-[#3A86FF] font-bold text-[11px] sm:text-xs uppercase tracking-widest truncate">
                  AVERAGE
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#1F2D2E] truncate">
                  {habit.avgStr}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col gap-1.5 min-w-0">
                <span className="text-[#3A86FF] font-bold text-[11px] sm:text-xs uppercase tracking-widest truncate">
                  CONSISTENCY
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#1F2D2E] truncate">
                  {habit.consistency}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col gap-1.5 min-w-0 sm:col-span-2 lg:col-span-1">
                <span className="text-[#3A86FF] font-bold text-[11px] sm:text-xs uppercase tracking-widest truncate">
                  BEST STREAK
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#1F2D2E] truncate">
                  {habit.streak}
                </span>
              </div>
            </div>

            {/* BIOVUE Insight */}
            <div className="bg-[#EAF6F6] rounded-2xl sm:rounded-3xl md:rounded-4xl p-4 sm:p-6 md:p-8 border border-teal-100 flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-[#0FA4A9] font-bold text-xs sm:text-sm tracking-widest uppercase">
                <ActivityIcon size={18} />
                BIOVUE INSIGHT
              </div>
              <p className="text-sm sm:text-base text-[#1F2D2E] italic">{biovueInsight || habit.insight}</p>
            </div>

            {/* Coach Note */}
            {habit.coachNote && (
              <div className="bg-[#F5F3FF] rounded-2xl sm:rounded-3xl md:rounded-4xl p-4 sm:p-6 md:p-8 border border-purple-100 flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <User size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-[#8B5CF6] font-bold text-base sm:text-[17px]">
                    Coach Note
                  </h3>
                </div>
                <p className="text-[#1F2D2E] italic text-sm sm:text-[15px] leading-relaxed">
                  {habit.coachNote}
                </p>
                {habit.coachName && (
                  <span className="text-[#94A3B8] font-bold text-[10px] sm:text-[11px] uppercase tracking-widest italic mt-1">
                    {habit.coachName}{habit.coachTime ? `. ${habit.coachTime}` : ""}
                  </span>
                )}
              </div>
            )}

            {/* Sticky-like Footer Button */}
            <div className="mt-4 sm:mt-8 mb-4">
              <button
                onClick={handleLogClick}
                className="w-full bg-[#0FA4A9] text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-[17px] hover:bg-opacity-90 transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20 flex items-center justify-center gap-2 group"
              >
                <Calendar size={18} className="sm:w-5 sm:h-5" />
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

