"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import {
  useGetTargetGoalQuery,
  TargetGoal,
} from "@/redux/features/api/TrainerDashboard/Clients/TargetGoal/PostTargetGoal";
import { useGetAdjustProgramQuery } from "@/redux/features/api/TrainerDashboard/Clients/AdjustProgram/GetAdjustProgram";
import {
  Target,
  Scale,
  Dumbbell,
  Footprints,
  Moon,
  Droplets,
  Flame,
  Pill,
  Calendar,
  MessageCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UserGoalsPage() {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || currentUser?.user_id;

  const numericUserId = Number(userId) || 0;

  const { data: goals, isLoading: goalsLoading } = useGetTargetGoalQuery(numericUserId, {
    skip: !numericUserId,
  });

  const { data: adjustData, isLoading: adjustLoading } = useGetAdjustProgramQuery(numericUserId, {
    skip: !numericUserId,
  });

  const isLoading = (goalsLoading && !goals) && (adjustLoading && !adjustData);

  // Fallback from AdjustProgram if TargetGoal record hasn't been synced yet
  const fallbackFromAdjust: TargetGoal | undefined = adjustData?.data
    ? {
        id: adjustData.data.id,
        user_id: adjustData.data.user_id,
        profession_id: (adjustData.data as any).profession_id || 0,
        target_weight: String(adjustData.data.target_weight || ""),
        weekly_workout_goal: Number(adjustData.data.weekly_workouts) || 3,
        daily_step_goal: 10000,
        sleep_target: adjustData.data.sleep_target_range || "8",
        water_target: adjustData.data.hydration_target
          ? Math.round(Number(adjustData.data.hydration_target) * 4)
          : 8,
        supplement_recommendation: [],
        supplement_notes: adjustData.data.note,
        calories: (adjustData.data as any).calories,
        protein: (adjustData.data as any).protein,
        carbs: (adjustData.data as any).carbs,
        fat: (adjustData.data as any).fat,
        macros: {
          calories: (adjustData.data as any).calories,
          protein: (adjustData.data as any).protein,
          carbs: (adjustData.data as any).carbs,
          fat: (adjustData.data as any).fat,
        },
        trainer: null,
        is_active: true,
        start_date: adjustData.data.created_at,
        end_date: adjustData.data.updated_at,
        created_at: adjustData.data.created_at,
        updated_at: adjustData.data.updated_at,
      }
    : undefined;

  // Active goal or most recent
  const activeGoal: TargetGoal | undefined =
    Array.isArray(goals) && goals.length > 0
      ? goals.find((g) => g.is_active) || goals[0]
      : fallbackFromAdjust;

  // Macro calculations
  const calories = Number(activeGoal?.calories || activeGoal?.macros?.calories || 0);
  const protein = Number(activeGoal?.protein || activeGoal?.macros?.protein || 0);
  const carbs = Number(activeGoal?.carbs || activeGoal?.macros?.carbs || 0);
  const fat = Number(activeGoal?.fat || activeGoal?.macros?.fat || 0);

  const macroSum = protein + carbs + fat;
  const proteinPct = macroSum > 0 ? Math.round((protein / macroSum) * 100) : 0;
  const carbsPct = macroSum > 0 ? Math.round((carbs / macroSum) * 100) : 0;
  const fatPct = macroSum > 0 ? Math.max(0, 100 - proteinPct - carbsPct) : 0;

  const coachName = activeGoal?.trainer?.name || "Your Assigned Coach";

  return (
    <div className="flex flex-col gap-6 py-6 px-4 sm:px-6 md:px-8 xl:px-12 max-w-7xl mx-auto w-full pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#E4EFFF] text-[#3A86FF]">
              <Target size={20} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F2D2E]">
              Coach Fitness Targets & Goals
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6F73]">
            Personalized fitness, nutrition, and lifestyle targets prescribed directly by your trainer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/user-dashboard/messages">
            <Button
              variant="outline"
              className="gap-2 border-[#0FA4A9] text-[#0FA4A9] hover:bg-[#0FA4A9]/10 font-semibold text-xs sm:text-sm"
            >
              <MessageCircle size={16} />
              Message Coach
            </Button>
          </Link>
          <Link href="/user-dashboard/habits">
            <Button className="gap-2 bg-[#0FA4A9] hover:bg-[#0FA4A9]/90 text-white font-semibold text-xs sm:text-sm shadow-xs">
              Log Today&apos;s Habits
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>

      {!activeGoal ? (
        /* Empty State */
        <Card className="border border-gray-100 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-[#3A86FF] mb-4">
            <Target size={32} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1F2D2E] mb-2">
            No Coach Targets Configured Yet
          </h3>
          <p className="text-xs sm:text-sm text-[#5F6F73] max-w-md mx-auto mb-6">
            Your trainer has not configured customized fitness targets for your account yet.
            Reach out to your coach to request a personalized goal plan!
          </p>
          <Link href="/user-dashboard/messages">
            <Button className="bg-[#0FA4A9] hover:bg-[#0FA4A9]/90 text-white font-medium text-xs sm:text-sm">
              <MessageCircle size={16} className="mr-2" />
              Chat With Your Coach
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Coach Banner */}
          <div className="bg-gradient-to-r from-[#0FA4A9]/10 via-[#3A86FF]/10 to-teal-50 border border-[#0FA4A9]/20 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#0FA4A9] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <UserCheck size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0FA4A9]">
                    Personalized Plan
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none text-[10px] px-2 py-0.5">
                    Active
                  </Badge>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#1F2D2E]">
                  Prescribed by {coachName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#5F6F73] self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-200/60">
              {activeGoal.start_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#3A86FF]" />
                  <span>
                    Started:{" "}
                    <strong className="text-[#1F2D2E]">
                      {new Date(activeGoal.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </strong>
                  </span>
                </div>
              )}
              {activeGoal.end_date && (
                <div className="flex items-center gap-1.5">
                  <Target size={14} className="text-[#0FA4A9]" />
                  <span>
                    Target Date:{" "}
                    <strong className="text-[#1F2D2E]">
                      {new Date(activeGoal.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Fitness Target Cards */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#5F6F73] mb-3">
              Core Fitness Targets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Target Weight */}
              <Card className="border border-gray-100 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-blue-200 transition-all">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#5F6F73] uppercase tracking-wider">
                      Target Weight
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3A86FF] flex items-center justify-center">
                      <Scale size={16} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-[#1F2D2E] tracking-tight">
                        {activeGoal.target_weight || "—"}
                      </span>
                      <span className="text-xs font-semibold text-[#5F6F73]">lbs</span>
                    </div>
                    <p className="text-[11px] text-[#5F6F73] mt-1">Goal weight prescribed by coach</p>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Workouts */}
              <Card className="border border-gray-100 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-indigo-200 transition-all">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#5F6F73] uppercase tracking-wider">
                      Weekly Workouts
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Dumbbell size={16} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-[#1F2D2E] tracking-tight">
                        {activeGoal.weekly_workout_goal || "—"}
                      </span>
                      <span className="text-xs font-semibold text-[#5F6F73]">days / week</span>
                    </div>
                    <p className="text-[11px] text-[#5F6F73] mt-1">Planned exercise sessions</p>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Step Goal */}
              <Card className="border border-gray-100 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-rose-200 transition-all">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#5F6F73] uppercase tracking-wider">
                      Daily Steps
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                      <Footprints size={16} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-[#1F2D2E] tracking-tight">
                        {activeGoal.daily_step_goal ? Number(activeGoal.daily_step_goal).toLocaleString() : "—"}
                      </span>
                      <span className="text-xs font-semibold text-[#5F6F73]">steps / day</span>
                    </div>
                    <p className="text-[11px] text-[#5F6F73] mt-1">Daily physical activity goal</p>
                  </div>
                </CardContent>
              </Card>

              {/* Sleep Target */}
              <Card className="border border-gray-100 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-amber-200 transition-all">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#5F6F73] uppercase tracking-wider">
                      Sleep Target
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Moon size={16} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-[#1F2D2E] tracking-tight">
                        {activeGoal.sleep_target || "—"}
                      </span>
                      <span className="text-xs font-semibold text-[#5F6F73]">hours / night</span>
                    </div>
                    <p className="text-[11px] text-[#5F6F73] mt-1">Recommended recovery time</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Nutrition & Macros Targets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border border-gray-100 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] lg:col-span-2">
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0FA4A9] flex items-center justify-center">
                      <Flame size={16} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-[#1F2D2E]">
                        Prescribed Nutrition & Macro Targets
                      </CardTitle>
                      <p className="text-xs text-[#5F6F73]">
                        Daily caloric intake and target macronutrient breakdown
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-[#E4EFFF] text-[#3A86FF] hover:bg-[#E4EFFF] border-none font-semibold text-xs">
                    {calories > 0 ? `${calories.toLocaleString()} kcal / day` : "Target Calories"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                {calories > 0 || protein > 0 || carbs > 0 || fat > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Protein */}
                      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-center">
                        <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                          Protein
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-blue-950">
                          {protein || 0}g
                        </span>
                        <span className="block text-[10px] text-blue-600/80 font-medium mt-0.5">
                          {proteinPct}% of macros
                        </span>
                      </div>

                      {/* Carbs */}
                      <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3.5 text-center">
                        <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">
                          Carbs
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-amber-950">
                          {carbs || 0}g
                        </span>
                        <span className="block text-[10px] text-amber-600/80 font-medium mt-0.5">
                          {carbsPct}% of macros
                        </span>
                      </div>

                      {/* Fat */}
                      <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3.5 text-center">
                        <span className="block text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-0.5">
                          Fat
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-rose-950">
                          {fat || 0}g
                        </span>
                        <span className="block text-[10px] text-rose-600/80 font-medium mt-0.5">
                          {fatPct}% of macros
                        </span>
                      </div>
                    </div>

                    {/* Macro Split Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-[#5F6F73] font-medium">
                        <span>Distribution Target</span>
                        <span>
                          P: {proteinPct}% • C: {carbsPct}% • F: {fatPct}%
                        </span>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                        <div
                          className="bg-blue-500 h-full transition-all"
                          style={{ width: `${proteinPct}%` }}
                          title={`Protein: ${proteinPct}%`}
                        />
                        <div
                          className="bg-amber-500 h-full transition-all"
                          style={{ width: `${carbsPct}%` }}
                          title={`Carbs: ${carbsPct}%`}
                        />
                        <div
                          className="bg-rose-500 h-full transition-all"
                          style={{ width: `${fatPct}%` }}
                          title={`Fat: ${fatPct}%`}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center text-xs text-[#5F6F73]">
                    No specific macro split has been entered yet for this target.
                  </div>
                )}

                {/* Hydration Target */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                      <Droplets size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1F2D2E] block">
                        Hydration Target
                      </span>
                      <span className="text-[11px] text-[#5F6F73]">
                        Daily recommended water intake
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-[#1F2D2E]">
                    {activeGoal.water_target
                      ? `${activeGoal.water_target} Glasses / ~${Number(activeGoal.water_target) * 8} oz`
                      : "64 oz (8 glasses)"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Prescribed Supplements */}
            <Card className="border border-gray-100 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Pill size={16} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-[#1F2D2E]">
                        Prescribed Supplements
                      </CardTitle>
                      <p className="text-xs text-[#5F6F73]">
                        Coach recommendations for optimal recovery
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {Array.isArray(activeGoal.supplement_recommendation) &&
                  activeGoal.supplement_recommendation.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {activeGoal.supplement_recommendation.map((supp, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-800 text-xs font-semibold capitalize"
                        >
                          <CheckCircle2 size={13} className="text-purple-600 shrink-0" />
                          <span>{supp.replace(/([A-Z])/g, " $1")}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#5F6F73] italic">
                      No specific supplements prescribed by coach yet.
                    </p>
                  )}

                  {activeGoal.supplement_notes && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="block text-[11px] font-bold text-[#5F6F73] uppercase tracking-wider mb-1">
                        Coach Notes:
                      </span>
                      <p className="text-xs text-[#1F2D2E] bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        {activeGoal.supplement_notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="p-5 pt-0">
                <Link href="/user-dashboard/assigned-programs" className="block">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold gap-1.5 text-[#3A86FF] hover:bg-blue-50 border-blue-200"
                  >
                    <Dumbbell size={14} />
                    View Assigned Workout Programs
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

