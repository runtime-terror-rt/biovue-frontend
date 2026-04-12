"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Crown,
  ArrowRight,
  Plus,
  Activity,
  Calendar,
  Archive,
  Moon,
  Repeat,
  Zap,
  HeartPulse,
  Dumbbell,
  Scale,
  Loader2,
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
import { useGetAiCurrentInsightsQuery } from "@/redux/features/api/userDashboard/Projection/AIInsightsAPI";
import { useGetUserOverviewChartQuery } from "@/redux/features/api/userDashboard/dashboardApi";

// --- Main Page ---
const UserDashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { data: profileResponse } = useGetProfileQuery(currentUser?.id, { skip: !currentUser?.id });
  const userName = profileResponse?.data?.name || currentUser?.name || "User";
  console.log(currentUser, "currentUser");

  const [showLogModal, setShowLogModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [dataSource, setDataSource] = useState<"device" | "manual">("device");
  const [days, setDays] = useState(7);
  
  const { data: healthReport, isLoading: isHealthLoading } = useGetHealthReportQuery();
  const { data: insightsData, isLoading: isInsightsLoading } = useGetAiCurrentInsightsQuery(currentUser?.id, { skip: !currentUser?.id });
  const { data: chartResponse, isLoading: isChartLoading } = useGetUserOverviewChartQuery(days);

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

  if (isHealthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#0FA4A9]" />
      </div>
    );
  }

  const rawData = healthReport?.data;
  const summary = rawData?.summary;
  const healthOverview = rawData?.health_overview;
  const chartData = chartResponse?.charts;
  const dynamicInsights = (insightsData?.insights || insightsData?.data) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content Area with Padding */}
      <div className="flex flex-col gap-6 py-6 container mx-auto pb-12">
        {/* Top Banner - Mirrored from Landing Page */}
        <DashboardBanner />

        {/* Welcome Message */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h2 className="text-lg font-bold text-[#1F2D2E] mb-1">
            Welcome, {userName}!
          </h2>
          <p className="text-sm text-[#5F6F73]">
            Complete your setup to unlock future features
          </p>
        </div>

        {/* AI Projections Banner */}
        <div className="relative overflow-hidden bg-white border-[1.5px] border-[#3A86FF] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 min-h-45">
          <div className="flex-1 flex flex-col items-start gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#3A86FF]">
              AI-Powered Body Projections
            </h2>
            <p className="text-[#5F6F73] text-sm md:text-base max-w-xl">
              Upload your photo and see your future body transformation with AI
              predictions
            </p>
            <Link href="/user-dashboard/projections">
              <button className="bg-[#0FA4A9] text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all mt-2 group cursor-pointer">
                Generate AI Body Projections
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
          </div>
          <div className="w-full md:w-auto flex flex-col gap-3 min-w-50">
            <div className="bg-white border border-[#3A86FF] rounded-xl p-4 flex flex-col transition-all cursor-pointer hover:bg-blue-50">
              <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider mb-2">
                Current Goal
              </span>
              <span className="text-[#3A86FF] font-bold text-lg">
                Build Athletic Lean Mass
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wellness Score */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:border-[#0FA4A9] transition-all">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider">
                Wellness Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#1F2D2E]">
                  {summary?.wellness_score || 0}
                </span>
                <span className="text-[#5F6F73] text-sm font-medium">
                  / 100
                </span>
              </div>
              {/* <span className="text-[#2DD4BF] text-[10px] font-medium flex items-center gap-1 mt-1">
                <Plus size={10} /> {summary?.wellness_score?.trend || "N/A"}
              </span> */}
            </div>
            <div className="w-16 h-16 rounded-full border-[1.5px] border-[#3A86FF] border-t-transparent flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Activity size={24} className="text-[#3A86FF]" />
            </div>
          </div>

          {/* Days Active */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:border-[#0FA4A9] transition-all">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider">
                Days Active
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#1F2D2E]">
                  {summary?.days_active || 0}
                </span>
              </div>
              <span className="text-[#2DD4BF] text-[10px] font-medium flex items-center gap-1 mt-1">
                Keep it up!
              </span>
            </div>
            <div className="w-16 h-16 rounded-xl bg-[#E4EFFF] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Calendar size={24} className="text-[#3A86FF]" />
            </div>
          </div>

          {/* Data Logged */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:border-[#0FA4A9] transition-all">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider">
                Data Logged
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#1F2D2E]">
                  {summary?.data_logged_entries || 0}
                </span>
              </div>
              <span className="text-[#2DD4BF] text-[10px] font-medium flex items-center gap-1 mt-1">
                Entries total
              </span>
            </div>
            <div className="w-16 h-16 rounded-xl bg-[#E4EFFF] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Archive size={24} className="text-[#3A86FF]" />
            </div>
          </div>
        </div>

        {/* Current Health Overview */}
        <div className="flex items-center justify-between mt-4">
          <h2 className="text-xl font-bold text-[#1F2D2E]">
            Current Health Overview
          </h2>
          {/* <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 bg-[#0FA4A9] text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm group cursor-pointer"
          >
            <Plus size={18} />
            Log today&apos;s data
          </button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Current Weight",
              value: healthOverview?.weight?.current || "N/A",
              unit: summary?.unit_system === "imperial" ? "lbs" : "kg",
              status: healthOverview?.weight?.status || "N/A",
              desc: `Target: ${healthOverview?.weight?.coach_target || "N/A"}`,
              color: "text-[#3A86FF]",
            },
            {
              label: "BMI",
              value: healthOverview?.bmi?.current || "N/A",
              unit: "",
              status: healthOverview?.bmi?.status || "N/A",
              desc: `Ideal Range: ${healthOverview?.bmi?.ideal_range || "N/A"}`,
              color: "text-[#F59E0B]",
            },
            {
              label: "Nutrition",
              value: healthOverview?.nutrition?.protein_servings || 0,
              unit: "protein serv.",
              status: healthOverview?.nutrition?.last_meal_balance || "N/A",
              desc: healthOverview?.nutrition?.note || "N/A",
              color: "text-[#2DD4BF]",
            },
            {
              label: "Daily Steps",
              value: healthOverview?.daily_steps?.current || 0,
              unit: "",
              status: "Coach Plan",
              desc: healthOverview?.daily_steps?.coach_plan || "N/A",
              color: "text-[#EF4444]",
            },
            {
              label: "Sleep Hours",
              value: healthOverview?.sleep_hours?.current || 0,
              unit: "hrs",
              status: "Coach Plan",
              desc: healthOverview?.sleep_hours?.coach_plan || "N/A",
              color: "text-[#3A86FF]",
            },
            {
              label: "Hydration",
              value: healthOverview?.hydration?.current_glasses || 0,
              unit: "Ounces",
              status: "Target",
              desc: (healthOverview?.hydration?.target || "N/A").replace(/glasses/gi, "Ounces"),
              color: "text-[#3A86FF]",
            },
            {
              label: "Stress & Mood",
              value: healthOverview?.stress_and_mood?.avg_stress_level || 0,
              unit: "/ 10",
              status: "Latest Mood",
              desc: healthOverview?.stress_and_mood?.latest_mood || "N/A",
              color: "text-[#F59E0B]",
            },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-3"
            >
              <span className="text-[#5F6F73] text-[10px] font-bold uppercase tracking-wider">
                {metric.label}
              </span>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-3xl font-bold", metric.color)}>
                  {metric.value === "N/A" ? "N/A" : 
                    typeof metric.value === "number"
                      ? Number.isInteger(metric.value)
                        ? metric.value
                        : metric.value.toFixed(2)
                     : metric.value}
                </span>
                <span className="text-[#5F6F73] text-sm font-medium">
                  {metric.unit}
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    metric.color.includes("EF4444")
                      ? "text-[#EF4444]"
                      : metric.color.includes("3A86FF")
                        ? "text-[#3A86FF]"
                        : metric.color.includes("2DD4BF")
                          ? "text-[#2DD4BF]"
                          : "text-[#F59E0B]",
                  )}
                >
                  {metric.status}
                </span>
                <span className="text-[#5F6F73] text-[11px] leading-tight">
                  {metric.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Your Progress & Trends */}
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1F2D2E]">
              Your Progress & Trends
            </h2>
            <div className="flex p-1 bg-white border border-gray-100 rounded-lg shadow-sm">
              {[
                { label: "Weekly", value: 7 },
                { label: "Monthly", value: 30 },
                { label: "Last 3 months", value: 90 }
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setDays(t.value)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer",
                    days === t.value
                      ? "bg-[#E4EFFF] text-[#3A86FF]"
                      : "text-[#5F6F73] hover:text-[#1F2D2E]",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <ChartsNutrition data={chartData} isLoading={isChartLoading} />
        </div>

        {/* Today's Focus - Dynamic Insights */}
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1F2D2E]">
              Today&apos;s focus
            </h2>
            <Link href="/user-dashboard/insights">
              <button className="flex items-center gap-2 bg-[#0FA4A9] text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm group cursor-pointer">
                View All Insights
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isInsightsLoading ? (
              <div className="col-span-2 flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#0FA4A9]" />
              </div>
            ) : dynamicInsights.slice(0, 2).map((insight: any, i: number) => {
              const cat = insight.category?.toLowerCase() || "";
              const categoryIcon = cat.includes("nutrition") ? <Zap size={20} className="text-[#1F2D2E]" />
                : cat.includes("cardio") || cat.includes("heart") ? <HeartPulse size={20} className="text-[#1F2D2E]" />
                : cat.includes("exercise") || cat.includes("muscle") ? <Dumbbell size={20} className="text-[#1F2D2E]" />
                : cat.includes("sleep") ? <Moon size={20} className="text-[#1F2D2E]" />
                : <Scale size={20} className="text-[#1F2D2E]" />;

              const priorityColor = insight.priority?.toUpperCase() === "HIGH"
                ? "text-pink-500 bg-pink-50"
                : insight.priority?.toUpperCase() === "LOW"
                  ? "text-green-500 bg-green-50"
                  : "text-blue-500 bg-blue-50";

              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-4 group hover:border-[#0FA4A9] transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#E4EFFF] transition-colors"
                    >
                      {categoryIcon}
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider", priorityColor)}>
                      {insight.priority?.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-bold text-[#1F2D2E]">
                      {insight.insight}
                    </h3>
                    <p className="text-xs text-[#5F6F73] italic">
                      {insight.why_this_matters ? `"${insight.why_this_matters}"` : `"${insight.category}"`}
                    </p>
                  </div>
                </div>
              );
            })}
            {!isInsightsLoading && dynamicInsights.length === 0 && (
              <>
                {[
                  {
                    title: "URGENT BIOMETRIC DATA VERIFICATION",
                    desc: '"The recorded height (432.0cm) and weight (91.0 lbs) result in a BMI of 2.2, which is physiologically impossible. This data suggests a major entry error."',
                    icon: <Scale size={20} className="text-[#3A86FF]" />,
                    badge: "HIGH PRIORITY",
                    iconBg: "bg-[#E4EFFF]",
                  },
                  {
                    title: "ADDRESS ANXIETY RISK FACTORS",
                    desc: '"Anxiety is identified as your primary health risk, which can impact sleep quality, recovery, and overall metabolic health."',
                    icon: <HeartPulse size={20} className="text-[#3A86FF]" />,
                    badge: "HIGH PRIORITY",
                    iconBg: "bg-[#E4EFFF]",
                  },
                ].map((focus, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-4 group hover:border-[#0FA4A9] transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          focus.iconBg,
                        )}
                      >
                        {focus.icon}
                      </div>
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wider">
                        {focus.badge}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-bold text-[#1F2D2E]">
                        {focus.title}
                      </h3>
                      <p className="text-xs text-[#5F6F73] italic">{focus.desc}</p>
                    </div>
                  </div>
                ))}
              </>
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
