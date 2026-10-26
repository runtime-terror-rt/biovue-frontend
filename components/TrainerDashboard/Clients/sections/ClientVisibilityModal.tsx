"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Utensils,
  Sparkles,
  User,
  Loader2,
  Calendar,
  Apple,
  Scale,
  Flame,
  Clock,
  HeartPulse,
  CheckCircle2,
  AlertCircle,
  Activity,
  Moon,
  Footprints,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Columns,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetNutritionShowQuery } from "@/redux/features/api/userDashboard/nutrition";
import { useGetFutureGoalProjectionQuery } from "@/redux/features/api/userDashboard/Projection/GetFutureGoal";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";

interface ClientVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number | string;
  clientName: string;
  initialTab?: "food" | "projections" | "profile";
}

export default function ClientVisibilityModal({
  isOpen,
  onClose,
  clientId,
  clientName,
  initialTab = "food",
}: ClientVisibilityModalProps) {
  const [activeTab, setActiveTab] = useState<"food" | "projections" | "profile">(
    initialTab,
  );
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Lightbox Zoom state for high-res projection image inspection
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [projectionViewMode, setProjectionViewMode] = useState<
    "projected" | "baseline" | "compare"
  >("projected");

  // Keep activeTab in sync with initialTab whenever modal opens or tab prop changes
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Reset lightbox zoom when closed
  useEffect(() => {
    if (!isLightboxOpen) {
      setLightboxZoom(1);
    }
  }, [isLightboxOpen]);

  // 1. Food log query
  const { data: nutritionData, isLoading: isNutritionLoading } =
    useGetNutritionShowQuery(
      {
        user_id: clientId,
        ...(selectedDate ? { date: selectedDate } : {}),
      },
      { skip: !isOpen || !clientId },
    );

  // 2. Projections query
  const { data: projectionData, isLoading: isProjectionLoading } =
    useGetFutureGoalProjectionQuery(clientId, {
      skip: !isOpen || !clientId,
    });

  // 3. Profile query
  const { data: profileData, isLoading: isProfileLoading } =
    useGetProfileQuery(clientId, {
      skip: !isOpen || !clientId,
    });

  const nutrition =
    nutritionData?.data?.nutrition || nutritionData?.nutrition;
  const foodItems = nutrition?.foods || [];
  const totalCalories =
    nutrition?.calories?.value || nutrition?.total_calories || 0;
  const macros = nutrition?.macros || {};
  const activeLogDate = nutritionData?.data?.log_date || selectedDate;
  const isLatestFallback = Boolean(nutritionData?.data?.is_latest_fallback);

  const projection = projectionData?.data;

  // Extract nested profile data safely
  const userObj = (profileData as any)?.data || (profileData as any)?.user || {};
  const userProfile = userObj.profile || {};
  const targetGoals = Array.isArray(userObj.target_goals)
    ? userObj.target_goals[0]
    : userObj.target_goals || userObj.targetGoals?.[0] || userObj.targetGoals || {};
  const medicalHistory = userObj.medical_history || userObj.medicalHistory;

  const fullName = userObj.name || clientName;
  const email = userObj.email || "N/A";

  const rawGender = userProfile.sex || userProfile.gender || userObj.gender;
  const gender = rawGender
    ? rawGender.charAt(0).toUpperCase() + rawGender.slice(1)
    : "N/A";
  const age = userProfile.age
    ? `${userProfile.age} yrs`
    : userObj.age
    ? `${userObj.age} yrs`
    : "N/A";

  const unit =
    userProfile.unit_system ||
    userProfile.unit ||
    (userProfile.height && Number(userProfile.height) > 110 ? "metric" : "imperial");
  const weightUnit = unit === "metric" ? "kg" : "lbs";

  const rawH = userProfile.height || userObj.height;
  let height = "N/A";
  if (rawH) {
    const numH = parseFloat(String(rawH));
    if (!isNaN(numH) && numH > 0) {
      if (numH > 100) {
        // Height stored in cm (e.g. 150-220 cm)
        if (unit === "imperial") {
          const totalInches = Math.round((numH / 2.54) * 10) / 10;
          const feet = Math.floor(totalInches / 12);
          const remInches = Math.round(totalInches % 12);
          height = `${totalInches} in (${feet}'${remInches}\")`;
        } else {
          height = `${Math.round(numH * 10) / 10} cm`;
        }
      } else if (numH <= 10) {
        // Height in feet
        if (unit === "metric") {
          height = `${Math.round(numH * 30.48 * 10) / 10} cm`;
        } else {
          const feet = Math.floor(numH);
          const remInches = Math.round((numH - feet) * 12);
          height = `${Math.round(numH * 12 * 10) / 10} in (${feet}'${remInches}\")`;
        }
      } else {
        // Height in inches
        if (unit === "metric") {
          height = `${Math.round(numH * 2.54 * 10) / 10} cm`;
        } else {
          const feet = Math.floor(numH / 12);
          const remInches = Math.round(numH % 12);
          height = `${Math.round(numH * 10) / 10} in (${feet}'${remInches}\")`;
        }
      }
    } else {
      height = `${rawH}`;
    }
  }

  // Current weight: resolve latest logged weight over static profile weight
  const currentWeightVal =
    userObj.current_weight ||
    userProfile.current_logged_weight ||
    userProfile.weight ||
    targetGoals?.current_weight ||
    userObj.weight;
  const initialWeightVal = userObj.initial_profile_weight || userProfile.weight;

  const currentWeight = currentWeightVal
    ? `${currentWeightVal} ${weightUnit}`
    : "N/A";

  const activityLevel =
    userProfile.activity_level ||
    userObj.activity_level ||
    (userProfile.workout_week ? `${userProfile.workout_week} workouts/wk` : null) ||
    "Moderate";

  const projCurrentWeight =
    currentWeightVal || projection?.current_weight;
  const projGoalWeight =
    projection?.est_weight ||
    projection?.future_weight ||
    targetGoals?.target_weight;
  const projTimeframe =
    projection?.timeframe ||
    projection?.duration ||
    (projection?.months_to_target ? `${projection.months_to_target} Months` : "3 Months");
  const projGoalTitle =
    projection?.goal || projection?.primary_goal || "Body Composition & Vitality";
  const projDescription =
    projection?.goal_description || projection?.description;

  // Baseline / Starting image for comparison
  const baselineImageUrl =
    projection?.image ||
    userProfile?.current_image ||
    userProfile?.image ||
    userObj?.image_url;

  const projectedImageUrl = projection?.projection_url;

  // Helper to render medical conditions cleanly
  const renderMedicalHistoryContent = () => {
    let parsedHistory: any = medicalHistory;
    if (typeof medicalHistory === "string") {
      try {
        parsedHistory = JSON.parse(medicalHistory);
      } catch {
        return (
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            {medicalHistory}
          </p>
        );
      }
    }

    const allConditions = [
      { key: "diabetes", label: "Diabetes" },
      { key: "high_blood_pressure", label: "High Blood Pressure" },
      { key: "high_cholesterol", label: "High Cholesterol" },
      { key: "heart_disease", label: "Heart Disease" },
      { key: "asthma", label: "Asthma" },
      { key: "athritis", label: "Arthritis" },
      { key: "depression", label: "Depression" },
      { key: "anxiety", label: "Anxiety" },
      { key: "sleep_apnea", label: "Sleep Apnea" },
      { key: "thyroid_issue", label: "Thyroid Issue" },
    ];

    const activeList = allConditions.filter(
      (c) =>
        parsedHistory &&
        (parsedHistory[c.key] === 1 ||
          parsedHistory[c.key] === true ||
          parsedHistory[c.key] === "1" ||
          parsedHistory[c.key] === "true")
    );

    const medication = parsedHistory?.current_medication;

    return (
      <div className="space-y-4">
        {/* Overall Status Banner */}
        {activeList.length > 0 ? (
          <div className="flex items-center gap-2 text-amber-900 bg-amber-50 px-3.5 py-2.5 rounded-xl border border-amber-200 text-xs font-semibold">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>
              {activeList.length} medical condition(s) reported by client. Please review carefully.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>
              No chronic medical conditions reported (All standard conditions marked clear)
            </span>
          </div>
        )}

        {/* 10 Standard Conditions Intake Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Medical Conditions Intake Checklist ({allConditions.length} Evaluated):
            </span>
            <span className="text-[11px] font-semibold text-gray-400">
              {activeList.length} Reported • {allConditions.length - activeList.length} Clear
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allConditions.map((cond) => {
              const isPositive =
                parsedHistory &&
                (parsedHistory[cond.key] === 1 ||
                  parsedHistory[cond.key] === true ||
                  parsedHistory[cond.key] === "1" ||
                  parsedHistory[cond.key] === "true");

              return (
                <div
                  key={cond.key}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all",
                    isPositive
                      ? "bg-rose-50/90 border-rose-200 text-rose-950 font-semibold"
                      : "bg-white border-gray-150 text-gray-700 font-medium"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        isPositive ? "bg-rose-500" : "bg-emerald-400"
                      )}
                    />
                    {cond.label}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0",
                      isPositive
                        ? "bg-rose-200 text-rose-800"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    )}
                  >
                    {isPositive ? "Yes / Reported" : "No / Clear"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Medication */}
        <div className="bg-white p-3.5 rounded-xl border border-purple-100 text-xs">
          <span className="font-bold text-gray-700 block mb-1">
            Current Medication / Regimen:
          </span>
          {medication ? (
            <p className="text-purple-900 font-semibold bg-purple-50/70 px-3 py-2 rounded-lg border border-purple-100/90">
              {medication}
            </p>
          ) : (
            <p className="text-gray-400 italic">None reported</p>
          )}
        </div>
      </div>
    );
  };

    return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-blue-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0FA4A9] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {clientName ? clientName.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F2D2E]">
                    {clientName}&apos;s Live Visibility
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5F6F73]">
                    Full coach view into client logs, projections & bio profile
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 px-5 sm:px-6 pt-4 border-b border-gray-100 overflow-x-auto">
              <button
                onClick={() => setActiveTab("food")}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "food"
                    ? "border-[#0FA4A9] text-[#0FA4A9]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <Utensils size={16} />
                Food & Nutrition Log
              </button>
              <button
                onClick={() => setActiveTab("projections")}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "projections"
                    ? "border-[#3A86FF] text-[#3A86FF]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <Sparkles size={16} />
                Client Projections
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "profile"
                    ? "border-[#8B5CF6] text-[#8B5CF6]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <User size={16} />
                Full Bio Profile
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: FOOD LOG */}
              {activeTab === "food" && (
                <div>
                  {isNutritionLoading ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
                      <Loader2 className="animate-spin text-[#0FA4A9]" size={32} />
                      <span className="text-sm">Loading client food log...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Date Filter & Fallback Banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                          <Calendar size={15} className="text-[#0FA4A9]" />
                          <span>Selected Date:</span>
                          <input
                            type="date"
                            value={selectedDate || activeLogDate || ""}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 shadow-2xs focus:outline-[#0FA4A9] cursor-pointer"
                          />
                          {selectedDate && (
                            <button
                              onClick={() => setSelectedDate("")}
                              className="text-xs text-[#0FA4A9] hover:underline font-bold cursor-pointer ml-1"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {isLatestFallback && (
                          <div className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                            Showing latest active entries from{" "}
                            <strong>{activeLogDate}</strong>
                          </div>
                        )}
                      </div>

                      {/* Macro Summary Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-4 flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0FA4A9]">
                            Total Calories
                          </span>
                          <span className="text-2xl font-black text-gray-900 mt-1">
                            {totalCalories}{" "}
                            <span className="text-xs font-semibold text-gray-500">
                              kcal
                            </span>
                          </span>
                        </div>
                        <div className="bg-[#EBF7EE] border border-[#C3E6CB] rounded-xl p-4 flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#155724]">
                            Protein
                          </span>
                          <span className="text-2xl font-black text-gray-900 mt-1">
                            {macros?.protein?.value || 0}{" "}
                            <span className="text-xs font-semibold text-gray-500">
                              g
                            </span>
                          </span>
                        </div>
                        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1E40AF]">
                            Carbs
                          </span>
                          <span className="text-2xl font-black text-gray-900 mt-1">
                            {macros?.carbs?.value || 0}{" "}
                            <span className="text-xs font-semibold text-gray-500">
                              g
                            </span>
                          </span>
                        </div>
                        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-4 flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#9A3412]">
                            Fats
                          </span>
                          <span className="text-2xl font-black text-gray-900 mt-1">
                            {macros?.fat?.value || 0}{" "}
                            <span className="text-xs font-semibold text-gray-500">
                              g
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Logged Foods List */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                            <Apple size={16} className="text-[#0FA4A9]" />
                            Logged Meals {activeLogDate ? `(${activeLogDate})` : ""}
                          </h4>
                          <span className="text-xs font-semibold text-gray-500">
                            {foodItems.length} items logged
                          </span>
                        </div>

                        {foodItems.length === 0 ? (
                          <div className="py-12 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400">
                            <Utensils size={32} className="mx-auto mb-2 opacity-40" />
                            <p className="text-sm font-semibold text-gray-600">
                              No foods logged by {clientName} for this date.
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              When client logs meals, their exact portions and macros will appear here in real-time.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {foodItems.map((f: any, idx: number) => {
                              const name =
                                typeof f === "string"
                                  ? f
                                  : f?.food?.name || f?.food?.food || f?.food || f?.name || "Food";
                              const cals =
                                f?.calories || f?.calorie || f?.total_calories || 0;
                              const p = f?.protein || f?.macros?.protein || 0;
                              const c = f?.carbs || f?.macros?.carbs || 0;
                              const fat =
                                f?.fat || f?.fats || f?.macros?.fat || 0;

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors"
                                >
                                  <div>
                                    <span className="font-bold text-sm text-gray-900">
                                      {name}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2 font-medium">
                                      {f?.quantity ? `${f.quantity} ${f.unit || ""}` : ""}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs font-semibold">
                                    <span className="text-gray-900 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                                      {cals} kcal
                                    </span>
                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                      P: {p}g
                                    </span>
                                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                      C: {c}g
                                    </span>
                                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                      F: {fat}g
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PROJECTIONS (High-Res & Full Visibility) */}
              {activeTab === "projections" && (
                <div>
                  {isProjectionLoading ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
                      <Loader2 className="animate-spin text-[#3A86FF]" size={32} />
                      <span className="text-sm">Loading client projections...</span>
                    </div>
                  ) : projection ? (
                    <div className="space-y-6">
                      {/* View Mode Switcher if Baseline Image Exists */}
                      {baselineImageUrl && projectedImageUrl && (
                        <div className="flex items-center justify-between bg-blue-50/50 p-2 rounded-xl border border-blue-100">
                          <span className="text-xs font-bold text-gray-600 px-2 flex items-center gap-1.5">
                            <Eye size={14} className="text-[#3A86FF]" />
                            View Mode:
                          </span>
                          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => setProjectionViewMode("projected")}
                              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                                projectionViewMode === "projected"
                                  ? "bg-[#3A86FF] text-white shadow-xs"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              AI Projected Goal
                            </button>
                            <button
                              type="button"
                              onClick={() => setProjectionViewMode("baseline")}
                              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                                projectionViewMode === "baseline"
                                  ? "bg-[#3A86FF] text-white shadow-xs"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              Baseline (Current)
                            </button>
                            <button
                              type="button"
                              onClick={() => setProjectionViewMode("compare")}
                              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                                projectionViewMode === "compare"
                                  ? "bg-[#3A86FF] text-white shadow-xs"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              <Columns size={12} />
                              Side-by-Side
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* High-Resolution Uncropped Projection Image Container */}
                        {projectedImageUrl ? (
                          <div className="flex flex-col gap-2">
                            {projectionViewMode === "compare" && baselineImageUrl ? (
                              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 shadow-md">
                                <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Baseline Body
                                  </span>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={baselineImageUrl}
                                    alt="Baseline Client Body"
                                    className="max-h-[360px] w-full object-contain rounded-lg bg-black/60"
                                  />
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-1">
                                    AI Projected Goal
                                  </span>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={projectedImageUrl}
                                    alt="Projected Goal"
                                    className="max-h-[360px] w-full object-contain rounded-lg bg-black/60"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => setIsLightboxOpen(true)}
                                className="rounded-2xl overflow-hidden border border-slate-800 shadow-md bg-slate-950 flex flex-col items-center justify-center relative group cursor-pointer transition-all hover:border-[#3A86FF]/50"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={
                                    projectionViewMode === "baseline" && baselineImageUrl
                                      ? baselineImageUrl
                                      : projectedImageUrl
                                  }
                                  alt="Projected Goal Physical Transformation"
                                  className="w-full max-h-[440px] object-contain p-2 transition-transform duration-200 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs sm:text-sm backdrop-blur-[2px]">
                                  <Maximize2 size={18} />
                                  <span>Click to Zoom & Full Inspection</span>
                                </div>
                                <div className="w-full p-2.5 bg-slate-900 border-t border-slate-800 text-white text-xs font-semibold flex items-center justify-between">
                                  <span>
                                    {projectionViewMode === "baseline"
                                      ? "Baseline Client Body"
                                      : "AI Bio-Projected Physical Transformation"}
                                  </span>
                                  <span className="text-[11px] text-[#3A86FF] flex items-center gap-1 font-bold">
                                    <ZoomIn size={14} /> Full View
                                  </span>
                                </div>
                              </div>
                            )}

                            <p className="text-[11px] text-gray-500 text-center italic">
                              Click image anytime to inspect high-resolution transformation in full screen.
                            </p>
                          </div>
                        ) : (
                          <div className="h-80 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center text-gray-400">
                            <Sparkles size={36} className="mb-2 text-[#3A86FF]" />
                            <p className="text-sm font-semibold text-gray-700">
                              No projection image generated yet
                            </p>
                          </div>
                        )}

                        {/* Projection details */}
                        <div className="space-y-4">
                          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#3A86FF] block mb-1">
                              Target Goal & Horizon
                            </span>
                            <h3 className="text-xl font-black text-gray-900">
                              {projGoalTitle}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              Projected Timeline: {projTimeframe}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Current Weight (Latest)
                              </span>
                              <p className="text-lg font-bold text-gray-900 mt-0.5">
                                {projCurrentWeight ? `${projCurrentWeight} ${weightUnit}` : "N/A"}
                              </p>
                            </div>
                            <div className="p-3.5 bg-teal-50/70 rounded-xl border border-teal-100">
                              <span className="text-[11px] font-bold text-[#0FA4A9] uppercase tracking-wider">
                                Projected Goal Weight
                              </span>
                              <p className="text-lg font-bold text-[#0FA4A9] mt-0.5">
                                {projGoalWeight ? `${projGoalWeight} ${weightUnit}` : "N/A"}
                              </p>
                            </div>
                          </div>

                          {projDescription && (
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed">
                              <span className="font-bold block text-gray-900 mb-1">
                                Bio-Insight Summary:
                              </span>
                              {projDescription}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400">
                      <Sparkles size={32} className="mx-auto mb-2 text-[#3A86FF] opacity-60" />
                      <p className="text-sm font-semibold text-gray-700">
                        No projections found for {clientName}.
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Client has not yet generated an AI future projection.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FULL PROFILE */}
              {activeTab === "profile" && (
                <div>
                  {isProfileLoading ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
                      <Loader2 className="animate-spin text-[#8B5CF6]" size={32} />
                      <span className="text-sm">Loading client bio profile...</span>
                    </div>
                  ) : userObj && userObj.id ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Full Name
                          </span>
                          <p className="text-base font-bold text-gray-900 mt-1">
                            {fullName}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Email
                          </span>
                          <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                            {email}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Gender / Age
                          </span>
                          <p className="text-base font-bold text-gray-900 mt-1">
                            {gender} • {age}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Height
                          </span>
                          <p className="text-base font-bold text-gray-900 mt-1">
                            {height}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Current Weight (Live Log)
                          </span>
                          <p className="text-base font-bold text-gray-900 mt-1">
                            {currentWeight}
                          </p>
                          {initialWeightVal &&
                            currentWeightVal &&
                            String(initialWeightVal) !== String(currentWeightVal) && (
                              <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                                Initial: {initialWeightVal} {weightUnit}
                              </span>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Activity Level
                          </span>
                          <p className="text-base font-bold text-gray-900 mt-1 capitalize">
                            {activityLevel}
                          </p>
                        </div>
                      </div>

                      {/* Health & Lifestyle Highlights if present */}
                      {(userProfile.daily_step || userProfile.sleep_hour || userProfile.body_fat) && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {userProfile.daily_step && (
                            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                              <Footprints size={18} className="text-[#0FA4A9]" />
                              <div>
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                                  Daily Step Target
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {Number(userProfile.daily_step).toLocaleString()} steps
                                </span>
                              </div>
                            </div>
                          )}
                          {userProfile.sleep_hour && (
                            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                              <Moon size={18} className="text-[#3A86FF]" />
                              <div>
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                                  Sleep
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {userProfile.sleep_hour} hrs/night
                                </span>
                              </div>
                            </div>
                          )}
                          {userProfile.body_fat && (
                            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                              <Activity size={18} className="text-[#8B5CF6]" />
                              <div>
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                                  Body Fat
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {userProfile.body_fat}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Medical History or Health Notes */}
                      <div className="p-5 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-[#8B5CF6] font-bold text-xs uppercase tracking-wider">
                          <HeartPulse size={16} />
                          Medical History & Considerations
                        </div>
                        {renderMedicalHistoryContent()}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400">
                      <User size={32} className="mx-auto mb-2 text-gray-400 opacity-60" />
                      <p className="text-sm font-semibold text-gray-700">
                        Profile details could not be retrieved.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* FULL-SCREEN PROJECTION LIGHTBOX MODAL */}
      {isLightboxOpen && projectedImageUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          {/* Top Bar with Controls */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <div className="bg-slate-900/80 border border-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-sm">
              {clientName}&apos;s Transformation Projection (High Resolution Inspection)
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-700 rounded-xl p-1 text-white">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((prev) => Math.min(prev + 0.25, 2.5))}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom((prev) => Math.max(prev - 0.25, 0.75))}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(1)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw size={16} />
                </button>
                <span className="text-xs px-2 font-mono text-slate-300">
                  {Math.round(lightboxZoom * 100)}%
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Centered High-Res Image with Zoom */}
          <div className="overflow-auto max-w-[95vw] max-h-[85vh] flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                projectionViewMode === "baseline" && baselineImageUrl
                  ? baselineImageUrl
                  : projectedImageUrl
              }
              alt="High Resolution Projection Inspection"
              style={{ transform: `scale(${lightboxZoom})`, transformOrigin: "center center" }}
              className="max-h-[80vh] w-auto object-contain transition-transform duration-150 rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
