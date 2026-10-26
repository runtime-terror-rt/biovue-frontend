"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  ReferenceLine,
} from "recharts";
import { Info, Scale, Activity, Utensils, Moon, Loader2, Flame, Target, TrendingUp, TrendingDown } from "lucide-react";
import { useGetUserOverviewChartQuery } from "@/redux/features/api/TrainerDashboard/Clients/ClientsChart";
import { cn } from "@/lib/utils";

interface ProgressTrendsProps {
  clientId: number;
}

const getDateRangeDays = (startDate: string, endDate: string): number => {
  if (!startDate && !endDate) return 30;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const diff = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((today.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 30;
  }

  return 30;
};

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

  const calculatedPercentage = item.percentage !== undefined && item.percentage !== null
    ? Number(item.percentage)
    : item.adherence !== undefined && item.adherence !== null
    ? Number(item.adherence)
    : rawTarget > 0
    ? Math.round((effectiveCalories / rawTarget) * 100)
    : 0;

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

  const basePct = Math.min(calculatedPercentage, 100);
  const proteinPct = Math.round(basePct * ratioP * 10) / 10;
  const carbsPct = Math.round(basePct * ratioC * 10) / 10;
  const fatsPct = Math.max(0, Math.round((basePct - proteinPct - carbsPct) * 10) / 10);
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

export default function ProgressTrends({ clientId }: ProgressTrendsProps) {
  const [weightStartDate, setWeightStartDate] = useState<string>("");
  const [weightEndDate, setWeightEndDate] = useState<string>("");
  const [activityStartDate, setActivityStartDate] = useState<string>("");
  const [activityEndDate, setActivityEndDate] = useState<string>("");
  const [nutritionTimeframe, setNutritionTimeframe] = useState<string>("Weekly");
  const [nutritionStartDate, setNutritionStartDate] = useState<string>("");
  const [nutritionEndDate, setNutritionEndDate] = useState<string>("");
  const [sleepStartDate, setSleepStartDate] = useState<string>("");
  const [sleepEndDate, setSleepEndDate] = useState<string>("");

  const { data: weightRes, isLoading: weightLoading } = useGetUserOverviewChartQuery({
    userId: clientId,
    days: getDateRangeDays(weightStartDate, weightEndDate),
  });

  const { data: activityRes, isLoading: activityLoading } = useGetUserOverviewChartQuery({
    userId: clientId,
    days: getDateRangeDays(activityStartDate, activityEndDate),
  });

  const nutritionDays =
    nutritionStartDate || nutritionEndDate
      ? getDateRangeDays(nutritionStartDate, nutritionEndDate)
      : nutritionTimeframe === "Weekly"
      ? 7
      : nutritionTimeframe === "Monthly"
      ? 30
      : 90;

  const { data: nutritionRes, isLoading: nutritionLoading } = useGetUserOverviewChartQuery({
    userId: clientId,
    days: nutritionDays,
  });

  const { data: sleepRes, isLoading: sleepLoading } = useGetUserOverviewChartQuery({
    userId: clientId,
    days: getDateRangeDays(sleepStartDate, sleepEndDate),
  });

  const weightCharts = weightRes?.charts || [];
  const weightData = weightCharts.map((d) => ({ day: d.label, weight: d.weight }));

  const activityCharts = activityRes?.charts || [];
  const activityData = activityCharts.map((d) => ({ day: d.label, steps: d.steps }));

  const userCalorieTarget = Number(
    nutritionRes?.current_day_calorie_box?.target_calories || 2000
  );

  const macroTargets = {
    protein: Math.round((userCalorieTarget * 0.3) / 4),
    carbs: Math.round((userCalorieTarget * 0.5) / 4),
    fat: Math.round((userCalorieTarget * 0.2) / 9),
  };

  const nutritionCharts = nutritionRes?.charts || [];
  const processedNutritionData = nutritionCharts.map((item: any) =>
    calculateNutritionChartItem(
      {
        label: item.label,
        date: item.date || item.label,
        protein: item.nutrition?.protein,
        carbs: item.nutrition?.carbs,
        fats: item.nutrition?.fats,
        calories: item.nutrition?.calories,
        percentage: item.nutrition?.calorie_percentage ?? item.nutrition?.adherence_pct,
      },
      userCalorieTarget,
      macroTargets
    )
  );

  const sleepCharts = sleepRes?.charts || [];
  const sleepData = sleepCharts.map((d) => ({ day: d.label, hours: d.sleep_hours }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#111827]">Progress & Trends</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Weight Progress */}
        <Card className="border-none shadow-xs bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
              <div className="flex gap-3">
                <div className="p-2 bg-[#F0FDFA] text-[#0D9488] rounded-lg h-fit">
                  <Scale size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">
                    Weight Progress
                  </h3>
                  <p className="text-[10px] text-[#9CA3AF]">
                    Based on logged body weight
                  </p>
                  <p className="text-[10px] text-[#4F46E5] font-medium mt-1 uppercase">
                    coach - aligned
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#9CA3AF]">From</span>
                  <input
                    type="date"
                    value={weightStartDate}
                    onChange={(e) => setWeightStartDate(e.target.value)}
                    className="text-xs border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#9CA3AF]">To</span>
                  <input
                    type="date"
                    value={weightEndDate}
                    onChange={(e) => setWeightEndDate(e.target.value)}
                    className="text-xs border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600"
                  />
                </div>
                <Info size={14} className="text-[#D1D5DB]" />
              </div>
            </div>

            <div className="h-50 w-full mt-4">
              {weightLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0D9488]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightData}>
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#25CD25" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#25CD25" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="weight" stroke="#25CD25" strokeWidth={1.5} fillOpacity={1} fill="url(#weightGradient)" connectNulls />
                    <Line type="monotone" dataKey={() => weightRes?.health_overview?.weight?.target || null} stroke="#9CA3AF" strokeDasharray="3 3" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              <div className="flex justify-center items-center gap-2 ">
                <div className="w-2.5 h-2.5 bg-[#C8F2C8] rounded-sm"></div>
                <span className="text-[10px] font-bold text-[#111827]">Weight(lbs)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Trends */}
        <Card className="border-none shadow-xs bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
              <div className="flex gap-3">
                <div className="p-2 bg-[#F0FDFA] text-[#0D9488] rounded-lg h-fit">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">
                    Activity Trends
                  </h3>
                  <p className="text-[10px] text-[#9CA3AF]">
                    Daily movement from logged activity
                  </p>
                  <p className="text-[10px] text-[#4F46E5] font-medium mt-1 uppercase">
                    coach - aligned
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#9CA3AF]">From</span>
                  <input
                    type="date"
                    value={activityStartDate}
                    onChange={(e) => setActivityStartDate(e.target.value)}
                    className="text-xs border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#9CA3AF]">To</span>
                  <input
                    type="date"
                    value={activityEndDate}
                    onChange={(e) => setActivityEndDate(e.target.value)}
                    className="text-xs border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600"
                  />
                </div>
                <Info size={14} className="text-[#D1D5DB]" />
              </div>
            </div>

            <div className="h-45 w-full mt-4">
              {activityLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0D9488]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="steps" stroke="none" fillOpacity={1} fill="#C8F2C8" />
                    <Line type="monotone" dataKey={() => activityRes?.health_overview?.steps?.target || null} stroke="#C8F2C8" strokeDasharray="3 3" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              <div className="flex justify-center items-center gap-2 mt-2">
                <div className="w-2.5 h-2.5 bg-[#C8F2C8] rounded-sm"></div>
                <span className="text-[10px] font-bold text-[#111827]">Steps</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Overview */}
        <Card className="border-none shadow-xs bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex gap-3">
                  <div className="p-2 bg-[#EFF6FF] text-[#3B82F6] rounded-lg h-fit">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">
                      Nutrition Overview
                    </h3>
                    <p className="text-[10px] text-[#9CA3AF]">
                      Based on logged meals and nutrition quality
                    </p>
                  </div>
                </div>

                {/* Timeframe Buttons */}
                <div className="flex items-center gap-1 p-0.5 bg-gray-50 border border-gray-200 rounded-lg shrink-0">
                  {["Weekly", "Monthly", "Last 3 months"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setNutritionTimeframe(t);
                        setNutritionStartDate("");
                        setNutritionEndDate("");
                      }}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap",
                        t === nutritionTimeframe && !nutritionStartDate && !nutritionEndDate
                          ? "bg-[#D9E6FF] text-[#1F2D2E] shadow-2xs font-bold"
                          : "text-[#5F6F73] hover:bg-white"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Macro Target Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF7EE] text-[#1E7E34] border border-[#C3E6CB]">
                  <span className="w-2 h-2 rounded-full bg-[#3AAB67] shrink-0" />
                  <span>Protein</span>
                  <span className="font-bold text-[#155724] ml-0.5">{macroTargets.protein}g</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                  <span className="w-2 h-2 rounded-full bg-[#60A5FA] shrink-0" />
                  <span>Carbs</span>
                  <span className="font-bold text-[#1E40AF] ml-0.5">{macroTargets.carbs}g</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]">
                  <span className="w-2 h-2 rounded-full bg-[#FB923C] shrink-0" />
                  <span>Fat</span>
                  <span className="font-bold text-[#9A3412] ml-0.5">{macroTargets.fat}g</span>
                </div>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              {nutritionLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0D9488]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={processedNutritionData}
                    margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
                    barGap={0}
                    barCategoryGap="25%"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 500 }}
                      tickFormatter={(val) => `${val}%`}
                      domain={[
                        0,
                        (dataMax: number) =>
                          Math.max(120, Math.ceil((dataMax + 15) / 20) * 20),
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
                        fontSize: 10,
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
                          <div className="bg-white p-3.5 rounded-xl shadow-xl border border-gray-100 text-xs flex flex-col gap-2 min-w-[200px] z-50">
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
                      barSize={18}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="CarbsPct"
                      name="Carbs"
                      stackId="a"
                      fill="#60A5FA"
                      barSize={18}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="FatsPct"
                      name="Fat"
                      stackId="a"
                      fill="#FB923C"
                      barSize={18}
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="OveragePct"
                      name="Over Target"
                      stackId="a"
                      fill="#EF4444"
                      barSize={18}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex justify-center flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3AAB67]"></div>
                <span className="text-[10px] font-bold text-gray-600">Protein</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]"></div>
                <span className="text-[10px] font-bold text-gray-600">Carbs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FB923C]"></div>
                <span className="text-[10px] font-bold text-gray-600">Fats</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                <span className="text-[10px] font-bold text-gray-600">Over Target</span>
              </div>
            </div>

            {/* Current Day Calorie Intake Total Box Underneath the Graph */}
            {(() => {
              const calorieBox = nutritionRes?.current_day_calorie_box;
              const todayChartItem = processedNutritionData && processedNutritionData.length > 0
                ? processedNutritionData[processedNutritionData.length - 1]
                : null;
              const fallbackIntake = Number(todayChartItem?.calories ?? 0);
              const intake = Number(calorieBox?.intake_calories ?? 0) > 0
                ? Number(calorieBox?.intake_calories)
                : fallbackIntake;
              const target = Number(calorieBox?.target_calories ?? 2000);
              const diff = Number(calorieBox?.intake_calories && Number(calorieBox.intake_calories) > 0 && calorieBox.difference !== undefined
                ? calorieBox.difference
                : (intake - target));
              const absDiff = Math.abs(diff);
              const isOver = diff > 0;
              const isUnder = diff < 0;
              const pct = target > 0 ? Math.round((intake / target) * 100) : 0;

              return (
                <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-teal-50/80 via-blue-50/50 to-slate-50 border border-teal-100 shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-xs",
                          isOver
                            ? "bg-red-100 text-red-600 border border-red-200/60"
                            : "bg-teal-100 text-[#0FA4A9] border border-teal-200/60",
                        )}
                      >
                        <Flame size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6F73]">
                            Today&apos;s Calorie Intake
                          </span>
                          <span className="text-[9px] font-semibold text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                            {calorieBox?.date || "Today"}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-[#1F2D2E]">
                            {intake.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-[#5F6F73]">
                            / {target.toLocaleString()} kcal goal
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Over / Under indicator badge */}
                    <div>
                      {intake === 0 ? (
                        <div className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-bold border border-gray-200 flex items-center gap-1">
                          <Target size={12} />
                          <span>No meals logged today</span>
                        </div>
                      ) : isOver ? (
                        <div className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold flex items-center gap-1">
                          <TrendingUp size={12} className="text-red-600" />
                          <span>+{absDiff.toLocaleString()} kcal over target</span>
                        </div>
                      ) : isUnder ? (
                        <div className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#0FA4A9] border border-teal-200 text-[11px] font-bold flex items-center gap-1">
                          <TrendingDown size={12} className="text-[#0FA4A9]" />
                          <span>{absDiff.toLocaleString()} kcal under target</span>
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#10B981] border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                          <Target size={12} />
                          <span>Right on Target!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar in center */}
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between text-[10px] font-semibold text-[#5F6F73]">
                      <span>Daily Goal Progress</span>
                      <span
                        className={cn(
                          "font-bold",
                          isOver ? "text-red-600" : "text-[#0FA4A9]",
                        )}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200/80 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          isOver ? "bg-red-500" : "bg-[#0FA4A9]",
                        )}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Sleep patterns */}
        <Card className="border-none shadow-xs bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
              <div className="flex gap-3">
                <div className="p-2 bg-[#F0FDFA] text-[#0D9488] rounded-lg h-fit">
                  <Moon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">
                    Sleep patterns
                  </h3>
                  <p className="text-[10px] text-[#9CA3AF]">
                    Based on logged sleep duration and consistency
                  </p>
                  <p className="text-[10px] text-[#4F46E5] font-medium mt-1 uppercase">
                    coach - aligned
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#9CA3AF]">From</span>
                  <input
                    type="date"
                    value={sleepStartDate}
                    onChange={(e) => setSleepStartDate(e.target.value)}
                    className="text-xs border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#9CA3AF]">To</span>
                  <input
                    type="date"
                    value={sleepEndDate}
                    onChange={(e) => setSleepEndDate(e.target.value)}
                    className="text-xs border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600"
                  />
                </div>
                <Info size={14} className="text-[#D1D5DB]" />
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              {sleepLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0D9488]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={sleepData}
                    margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 500 }}
                      tickFormatter={(val) => `${val}h`}
                      domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax + 2))]}
                    />
                    <ReferenceLine
                      y={7.5}
                      stroke="#8B5CF6"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: "Target 7.5h",
                        position: "insideTopRight",
                        fill: "#8B5CF6",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 text-xs flex flex-col gap-1.5 min-w-[150px] z-50">
                            <span className="font-bold text-[#1F2D2E]">{data.day}</span>
                            <div className="flex justify-between items-center text-gray-600">
                              <span>Sleep Duration:</span>
                              <span className="font-bold text-[#8B5CF6]">{data.hours || 0} hrs</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                              <span>Coach Target:</span>
                              <span>7.5 - 8.0 hrs</span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#sleepGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex justify-center flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></div>
                <span className="text-[10px] font-bold text-gray-600">Sleep Duration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 border-t-2 border-dashed border-[#8B5CF6]"></div>
                <span className="text-[10px] font-bold text-gray-600">Target (7.5h)</span>
              </div>
            </div>

            {/* Today's Sleep & Recovery Intake Box Underneath */}
            {(() => {
              const latestSleepItem =
                sleepData && sleepData.length > 0 ? sleepData[sleepData.length - 1] : null;
              const currentSleep = Number(latestSleepItem?.hours ?? 0);
              const sleepTarget = 8.0;
              const sleepPct = Math.round((currentSleep / sleepTarget) * 100);
              const isOptimal = currentSleep >= 7.0 && currentSleep <= 9.0;
              const isUnder = currentSleep > 0 && currentSleep < 7.0;

              return (
                <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-slate-50 border border-purple-100 shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-xs bg-purple-100 text-[#8B5CF6] border border-purple-200/60">
                        <Moon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6F73]">
                            Today&apos;s Sleep & Recovery
                          </span>
                          <span className="text-[9px] font-semibold text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                            {latestSleepItem?.day || "Today"}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-[#1F2D2E]">
                            {currentSleep}
                          </span>
                          <span className="text-[10px] font-bold text-[#5F6F73]">
                            / {sleepTarget} hrs goal
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div>
                      {currentSleep === 0 ? (
                        <div className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-bold border border-gray-200 flex items-center gap-1">
                          <Moon size={12} />
                          <span>No sleep logged today</span>
                        </div>
                      ) : isOptimal ? (
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#10B981] border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                          <span>Optimal Rest (7-9 hrs)</span>
                        </div>
                      ) : isUnder ? (
                        <div className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold flex items-center gap-1">
                          <span>{(sleepTarget - currentSleep).toFixed(1)} hrs below target</span>
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold flex items-center gap-1">
                          <span>+{(currentSleep - sleepTarget).toFixed(1)} hrs over target</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between text-[10px] font-semibold text-[#5F6F73]">
                      <span>Sleep Goal Progress</span>
                      <span className="font-bold text-[#8B5CF6]">
                        {sleepPct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-[#8B5CF6]"
                        style={{ width: `${Math.min(100, sleepPct)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
