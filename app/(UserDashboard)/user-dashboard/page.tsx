"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Calendar,
  Archive,
  Moon,
  Zap,
  HeartPulse,
  Dumbbell,
  Scale,
  Loader2,
  Footprints,
  Flame,
  Droplets,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import LogTodayModal from "@/components/dashboard/LogTodayModal";
import ChangeSourceModal from "@/components/dashboard/ChangeSourceModal";
import ChartsNutrition from "@/components/UserDashboard/Dashboard/ChartsNutrition";
import DashboardBanner from "@/components/UserDashboard/Dashboard/DashboardBanner";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { useGetHealthReportQuery } from "@/redux/features/api/userDashboard/dashboard/health-report";
import { useGetInsightsQuery } from "@/redux/features/api/userDashboard/insightsApi";
import { useGetUserOverviewChartQuery } from "@/redux/features/api/userDashboard/dashboardApi";
import { useGetStressReportQuery } from "@/redux/features/api/userDashboard/stresslog";
import { useGetHydrationReportQuery } from "@/redux/features/api/userDashboard/hydration";
import TrainerMotivation from "@/components/UserDashboard/Dashboard/TrainerMotivation";
import TrialCountdownBanner from "@/components/dashboard/TrialCountdownBanner";

// --- Main Page ---
const UserDashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { data: profileResponse } = useGetProfileQuery(currentUser?.id, {
    skip: !currentUser?.id,
  });
  const userName = profileResponse?.data?.name || currentUser?.name || "User";
  console.log(currentUser, "currentUser");

  const [showLogModal, setShowLogModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [dataSource, setDataSource] = useState<"device" | "manual">("device");
  const [days, setDays] = useState(7);

  const { data: healthReport, isLoading: isHealthLoading } = useGetHealthReportQuery(undefined);
  const { data: insightsData, isLoading: isInsightsLoading } = useGetInsightsQuery(undefined, {
    skip: !currentUser?.id,
  });
  const { data: chartResponse, isLoading: isChartLoading } = useGetUserOverviewChartQuery(days);
  const { data: stressReport, isLoading: isStressLoading } = useGetStressReportQuery(days);
  const { data: hydrationReport, isLoading: isHydrationLoading } = useGetHydrationReportQuery(days);

  const [habitData, setHabitData] = useState({
    weight: "",
    bodyFat: "",
    smoking: "",
    alcohol: "",
    steps: "7500",
    workout: "5",
    strength: "2",
    sleep: "7.5",
    diet: "",
    fastFood: "",
    stress: "",
    water: "",
  });

  if (isHealthLoading && !healthReport) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#0FA4A9]" />
      </div>
    );
  }

  const rawData = healthReport?.data;
  const summary = rawData?.summary;
  const healthOverview = rawData?.health_overview;
  const weightCurrent = healthOverview?.weight?.current;
  const nutrition = healthOverview?.nutrition;
  const chartData = chartResponse?.charts;
  const dynamicInsights = (insightsData?.insights || insightsData?.data) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content Area with Padding */}
      <div className="flex flex-col gap-4 sm:gap-6 py-2 sm:py-4 md:py-6 px-6 md:px-8 xl:px-16 max-w-8xl mx-auto w-full pb-12">
        {/* Top Banner - Mirrored from Landing Page */}
        <DashboardBanner />

        {/* Welcome Message */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h2 className="text-base sm:text-lg font-bold text-[#1F2D2E] mb-0.5 sm:mb-1">
            Welcome, {userName}!
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6F73]">
            Complete your setup to unlock future features
          </p>
        </div>

        {/* Free Trial Countdown Banner */}
        <TrialCountdownBanner />

        {/* Motivational Message from Trainer */}
        <TrainerMotivation />

        {/* AI Projections Banner */}
        <div className="relative overflow-hidden bg-white border-[1.5px] border-[#3A86FF] rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 sm:gap-6 lg:gap-8">
          <div className="flex-1 flex flex-col items-start gap-3 sm:gap-4 min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#3A86FF] leading-snug">
              AI-Powered Body Projections
            </h2>
            <p className="text-[#5F6F73] text-xs sm:text-sm md:text-base max-w-xl">
              Upload your photo and see your future body transformation with AI
              predictions
            </p>
            <Link href="/user-dashboard/projections" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#0FA4A9] text-white px-5 sm:px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all text-xs sm:text-sm font-medium whitespace-nowrap active:scale-95 shadow-xs cursor-pointer">
                <span>Generate AI Body Projections</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform shrink-0"
                />
              </button>
            </Link>
          </div>
          <div className="w-full sm:w-auto flex flex-col gap-3 shrink-0 min-w-0 sm:min-w-[180px] lg:min-w-[210px]">
            <div className="bg-white border border-[#3A86FF] rounded-xl p-3.5 sm:p-4 flex flex-col transition-all cursor-pointer hover:bg-blue-50">
              <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider mb-1">
                Current Goal
              </span>
              <span className="text-[#3A86FF] font-bold text-sm sm:text-base lg:text-lg whitespace-nowrap">
                Build Athletic Lean Mass
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 md:gap-6">
          {/* Wellness Score */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:border-[#0FA4A9] transition-all">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider">
                Wellness Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#1F2D2E]">
                  {summary?.wellness_score || 0}
                </span>
                <span className="text-[#5F6F73] text-xs sm:text-sm font-medium">
                  / 100
                </span>
              </div>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-[1.5px] border-[#3A86FF] border-t-transparent flex items-center justify-center transform group-hover:rotate-12 transition-transform shrink-0">
              <Activity size={22} className="text-[#3A86FF] sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Days Active */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:border-[#0FA4A9] transition-all">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider">
                Days Active
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#1F2D2E]">
                  {summary?.logs_summary?.activity_days || 0}
                </span>
              </div>
              <span className="text-[#2DD4BF] text-[10px] font-medium flex items-center gap-1 mt-1">
                Keep it up!
              </span>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-[#E4EFFF] flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
              <Calendar size={22} className="text-[#3A86FF] sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Data Logged */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:border-[#0FA4A9] transition-all sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider">
                Data Logged
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#1F2D2E]">
                  {summary?.data_logged_entries || 0}
                </span>
              </div>
              <span className="text-[#2DD4BF] text-[10px] font-medium flex items-center gap-1 mt-1">
                Entries total
              </span>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-[#E4EFFF] flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
              <Archive size={22} className="text-[#3A86FF] sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Current Health Overview */}
        <div className="flex items-center justify-between mt-2 sm:mt-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2D2E]">
              Current Health Overview
            </h2>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 bg-slate-100/90 px-2.5 py-0.5 rounded-full">
              Live Metrics
            </span>
          </div>
        </div>

        {(() => {
          // 1. Daily Steps calculation
          const stepCurrent = typeof healthOverview?.daily_steps?.current === "string"
            ? parseInt(healthOverview.daily_steps.current.replace(/,/g, "")) || 0
            : (healthOverview?.daily_steps?.current || 0);
          const stepTarget = parseInt(String(healthOverview?.daily_steps?.coach_plan || "6000").replace(/[^0-9]/g, "")) || 6000;
          const stepPct = Math.min(100, Math.round((stepCurrent / Math.max(1, stepTarget)) * 100));

          // 2. Sleep calculation
          const sleepCurrent = parseFloat(String(healthOverview?.sleep_hours?.current || 0).replace(/[^0-9.]/g, "")) || 0;
          const sleepTarget = parseFloat(String(healthOverview?.sleep_hours?.coach_plan || 7).replace(/[^0-9.]/g, "")) || 7;
          const sleepPct = Math.min(100, Math.round((sleepCurrent / Math.max(1, sleepTarget)) * 100));

          // 3. Hydration calculation
          const hydroCurrent = parseFloat(String(healthOverview?.hydration?.current_oz || 0).replace(/[^0-9.]/g, "")) || 0;
          const hydroTarget = parseFloat(String(healthOverview?.hydration?.target || 80).replace(/[^0-9.]/g, "")) || 80;
          const hydroPct = Math.min(100, Math.round((hydroCurrent / Math.max(1, hydroTarget)) * 100));

          // 4. Nutrition Macros calculation
          const pVal = Number(nutrition?.total_protein || 0);
          const cVal = Number(nutrition?.total_carbs || 0);
          const fVal = Number(nutrition?.total_fat || 0);
          const macroSum = pVal + cVal + fVal;
          const pPct = macroSum > 0 ? Math.round((pVal / macroSum) * 100) : 0;
          const cPct = macroSum > 0 ? Math.round((cVal / macroSum) * 100) : 0;
          const fPct = macroSum > 0 ? Math.max(0, 100 - pPct - cPct) : 0;

          // 5. Stress & Mood
          const stressVal = Number(healthOverview?.stress_and_mood?.avg_stress_level || 0);
          const stressPct = Math.min(100, Math.max(10, Math.round((stressVal / 10) * 100)));
          const moodText = healthOverview?.stress_and_mood?.latest_mood || "Normal";

          // 6. Weight diff
          const weightStatus = healthOverview?.weight?.status || "On track";
          const isWeightAbove = weightStatus.toLowerCase().includes("above");

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {/* Card 1: Current Weight */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(58,134,255,0.06)] hover:border-blue-100 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3A86FF] flex items-center justify-center border border-blue-100/70 group-hover:scale-105 transition-transform">
                        <Scale className="w-4 h-4" />
                      </div>
                      <span className="text-[#5F6F73] text-[11px] font-bold uppercase tracking-wider">
                        Current Weight
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap",
                        isWeightAbove
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      )}
                    >
                      {weightStatus}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#041228] tracking-tight">
                      {weightCurrent || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs text-[#5F6F73] mt-2">
                  <span>Target: <strong className="text-[#041228] font-semibold">{healthOverview?.weight?.coach_target || "N/A"}</strong></span>
                  <span className="text-[11px] text-slate-400">
                    {(healthOverview?.weight as any)?.diff || "Target goal"}
                  </span>
                </div>
              </div>

              {/* Card 2: BMI */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(245,158,11,0.08)] hover:border-amber-100 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100/70 group-hover:scale-105 transition-transform">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="text-[#5F6F73] text-[11px] font-bold uppercase tracking-wider">
                        BMI Score
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200 whitespace-nowrap">
                      {healthOverview?.bmi?.status || "Healthy"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#041228] tracking-tight">
                      {healthOverview?.bmi?.current || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs text-[#5F6F73] mt-2">
                  <span>Ideal: <strong className="text-[#041228] font-semibold">{healthOverview?.bmi?.ideal_range || "18.5 - 24.9"}</strong></span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    Normal
                  </span>
                </div>
              </div>

              {/* Card 3: Daily Steps */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(239,68,68,0.08)] hover:border-rose-100 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100/70 group-hover:scale-105 transition-transform">
                        <Footprints className="w-4 h-4" />
                      </div>
                      <span className="text-[#5F6F73] text-[11px] font-bold uppercase tracking-wider">
                        Daily Steps
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200 whitespace-nowrap">
                      Plan: {healthOverview?.daily_steps?.coach_plan || "6,000"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#041228] tracking-tight">
                      {(healthOverview?.daily_steps?.current !== undefined && healthOverview?.daily_steps?.current !== null) ? String(healthOverview.daily_steps.current) : 0}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">steps</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100/80 space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#5F6F73]">
                    <span>Goal Completion</span>
                    <span className="font-bold text-[#041228]">{stepPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${stepPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: Sleep Hours */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(99,102,241,0.08)] hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100/70 group-hover:scale-105 transition-transform">
                        <Moon className="w-4 h-4" />
                      </div>
                      <span className="text-[#5F6F73] text-[11px] font-bold uppercase tracking-wider">
                        Sleep Hours
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200 whitespace-nowrap">
                      Goal: {healthOverview?.sleep_hours?.coach_plan || "7 Hrs"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#041228] tracking-tight">
                      {healthOverview?.sleep_hours?.current || 0}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100/80 space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#5F6F73]">
                    <span>Recovery Target</span>
                    <span className="font-bold text-[#041228]">{sleepPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${sleepPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 5: Nutrition & Macros (Double-Width Card - Spans 2 columns on lg) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(20,184,166,0.08)] hover:border-teal-100 transition-all duration-300 flex flex-col justify-between sm:col-span-2 group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100/70 group-hover:scale-105 transition-transform">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[#5F6F73] text-[11px] font-bold uppercase tracking-wider">
                          Nutrition & Intake
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-teal-50 text-teal-700 border-teal-200 whitespace-nowrap">
                      {nutrition?.last_meal_balance || "Today's Log"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#041228] tracking-tight">
                          {nutrition?.total_calories ?? 0}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-400">kcal</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">Total energy logged</p>
                    </div>

                    {/* Macro Breakdown Pills */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-blue-50/70 border border-blue-100/80 rounded-xl px-2.5 py-1.5 text-center">
                        <span className="block text-[9px] font-bold text-blue-600 uppercase tracking-wider">Protein</span>
                        <span className="text-xs font-extrabold text-blue-900">{pVal.toFixed(1)}g</span>
                      </div>
                      <div className="flex-1 bg-amber-50/70 border border-amber-100/80 rounded-xl px-2.5 py-1.5 text-center">
                        <span className="block text-[9px] font-bold text-amber-600 uppercase tracking-wider">Carbs</span>
                        <span className="text-xs font-extrabold text-amber-900">{cVal.toFixed(1)}g</span>
                      </div>
                      <div className="flex-1 bg-rose-50/70 border border-rose-100/80 rounded-xl px-2.5 py-1.5 text-center">
                        <span className="block text-[9px] font-bold text-rose-600 uppercase tracking-wider">Fat</span>
                        <span className="text-xs font-extrabold text-rose-900">{fVal.toFixed(1)}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Macro Ratio Bar */}
                <div className="pt-3 border-t border-slate-100/80 space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#5F6F73]">
                    <span>Macro Distribution</span>
                    <span className="text-slate-400 text-[10px]">P: {pPct}% • C: {cPct}% • F: {fPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div style={{ width: `${pPct}%` }} className="h-full bg-blue-500 transition-all duration-500" />
                    <div style={{ width: `${cPct}%` }} className="h-full bg-amber-500 transition-all duration-500" />
                    <div style={{ width: `${fPct}%` }} className="h-full bg-rose-500 transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Card 6: Hydration */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(6,182,212,0.08)] hover:border-cyan-100 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100/70 group-hover:scale-105 transition-transform">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <span className="text-[#5F6F73] text-[11px] font-bold uppercase tracking-wider">
                        Hydration
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-cyan-50 text-cyan-700 border-cyan-200 whitespace-nowrap">
                      Target: {healthOverview?.hydration?.target || "80 oz"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#041228] tracking-tight">
                      {healthOverview?.hydration?.current_oz || 0}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100/80 space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#5F6F73]">
                    <span>Hydration Level</span>
                    <span className="font-bold text-[#041228]">{hydroPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full transition-all duration-500"
                      style={{ width: `${hydroPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 7: Stress & Mood */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(139,92,246,0.08)] hover:border-violet-100 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100/70 group-hover:scale-105 transition-transform">
                        <Smile className="w-4 h-4" />
                      </div>
                      <span className="text-[#5F6F73] text-[11px] font-bold uppercase tracking-wider">
                        Stress & Mood
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-violet-50 text-violet-700 border-violet-200 capitalize whitespace-nowrap">
                      {moodText}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#041228] tracking-tight">
                      {healthOverview?.stress_and_mood?.avg_stress_level || 0}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">/ 10</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100/80 space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#5F6F73]">
                    <span>Mood Status</span>
                    <span className="font-semibold text-slate-700 capitalize">{moodText}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 rounded-full transition-all duration-500"
                      style={{ width: `${stressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Your Progress & Trends */}
        <div className="mt-6 sm:mt-8 flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2D2E]">
              Your Progress & Trends
            </h2>
            <div className="flex items-center p-1 bg-white border border-gray-100 rounded-xl shadow-xs self-start sm:self-auto overflow-x-auto max-w-full">
              {[
                { label: "Weekly", value: 7 },
                { label: "Monthly", value: 30 },
                { label: "Last 3 months", value: 90 }
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setDays(t.value)}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap",
                    days === t.value
                      ? "bg-[#E4EFFF] text-[#3A86FF] shadow-xs"
                      : "text-[#5F6F73] hover:text-[#1F2D2E]",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <ChartsNutrition
            data={chartData}
            stressData={stressReport}
            hydrationData={hydrationReport}
            isLoading={isChartLoading}
            isStressLoading={isStressLoading}
            isHydrationLoading={isHydrationLoading}
            unitSystem={summary?.unit_system || currentUser?.profile?.unit || "imperial"}
          />
        </div>

        {/* Today's Focus - Dynamic Insights */}
        <div className="mt-6 sm:mt-8 flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2D2E]">
              Today&apos;s focus
            </h2>
            <Link href="/user-dashboard/insights">
              <button className="flex items-center gap-1.5 sm:gap-2 bg-[#0FA4A9] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all text-xs sm:text-sm group cursor-pointer whitespace-nowrap active:scale-95 shadow-xs">
                <span>View All Insights</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 md:gap-6">
            {isInsightsLoading ? (
              <div className="col-span-1 md:col-span-2 flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#0FA4A9]" />
              </div>
            ) : dynamicInsights.slice(0, 2).map((insight: { category?: string; priority?: string; insight?: string; why_this_matters?: string }, i: number) => {
              const cat = insight.category?.toLowerCase() || "";
              const categoryIcon = cat.includes("nutrition") ? <Zap size={18} className="text-[#1F2D2E]" />
                : cat.includes("cardio") || cat.includes("heart") ? <HeartPulse size={18} className="text-[#1F2D2E]" />
                  : cat.includes("exercise") || cat.includes("muscle") ? <Dumbbell size={18} className="text-[#1F2D2E]" />
                    : cat.includes("sleep") ? <Moon size={18} className="text-[#1F2D2E]" />
                      : <Scale size={18} className="text-[#1F2D2E]" />;

              const priorityColor = insight.priority?.toUpperCase() === "HIGH"
                ? "text-pink-500 bg-pink-50"
                : insight.priority?.toUpperCase() === "LOW"
                  ? "text-green-500 bg-green-50"
                  : "text-blue-500 bg-blue-50";

              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-3 sm:gap-4 group transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[#E4EFFF] transition-colors shrink-0"
                    >
                      {categoryIcon}
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider", priorityColor)}>
                      {insight.priority?.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm sm:text-base font-bold text-[#1F2D2E] leading-snug">
                      {insight.insight}
                    </h3>
                    <p className="text-xs text-[#5F6F73] italic break-words">
                      {insight.why_this_matters ? `"${insight.why_this_matters}"` : `"${insight.category}"`}
                    </p>
                  </div>
                </div>
              );
            })}
            {!isInsightsLoading && dynamicInsights.length === 0 && (
              <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex items-center justify-center text-[#94A3B8] italic text-sm">
                No new AI insights generated at this time.
              </div>
            )}
          </div>
        </div>
      </div>

      <LogTodayModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onChangeSource={() => {
          setShowLogModal(false);
          setShowSourceModal(true);
        }}
        habitData={habitData}
        setHabitData={setHabitData}
        unitSystem={summary?.unit_system || "imperial"}
      />

      <ChangeSourceModal
        isOpen={showSourceModal}
        onClose={() => setShowSourceModal(false)}
        dataSource={dataSource}
        setDataSource={setDataSource}
      />
    </div>
  );
};

export default UserDashboard;
