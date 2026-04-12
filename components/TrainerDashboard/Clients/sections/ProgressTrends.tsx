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
} from "recharts";
import { Info, Scale, Activity, Utensils, Moon, Loader2 } from "lucide-react";
import { useGetUserOverviewChartQuery } from "@/redux/features/api/TrainerDashboard/Clients/ClientsChart";

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

export default function ProgressTrends({ clientId }: ProgressTrendsProps) {
  const [weightStartDate, setWeightStartDate] = useState<string>("");
  const [weightEndDate, setWeightEndDate] = useState<string>("");
  const [activityStartDate, setActivityStartDate] = useState<string>("");
  const [activityEndDate, setActivityEndDate] = useState<string>("");
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

  const { data: nutritionRes, isLoading: nutritionLoading } = useGetUserOverviewChartQuery({
    userId: clientId,
    days: getDateRangeDays(nutritionStartDate, nutritionEndDate),
  });

  const { data: sleepRes, isLoading: sleepLoading } = useGetUserOverviewChartQuery({
    userId: clientId,
    days: getDateRangeDays(sleepStartDate, sleepEndDate),
  });

  const weightCharts = weightRes?.charts || [];
  const weightData = weightCharts.map((d) => ({ day: d.label, weight: d.weight }));

  const activityCharts = activityRes?.charts || [];
  const activityData = activityCharts.map((d) => ({ day: d.label, steps: d.steps }));

  const nutritionCharts = nutritionRes?.charts || [];
  const nutritionData = nutritionCharts.map((d) => ({
    day: d.label,
    protein: d.nutrition.protein,
    carbs: d.nutrition.carbs,
    fats: d.nutrition.fats,
  }));

  const sleepCharts = sleepRes?.charts || [];
  const sleepData = sleepCharts.map((d) => ({ day: d.label, hours: d.sleep_hours }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#111827]">Progress & Trends</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="text-center mt-2">
                <span className="text-[10px] font-bold text-[#111827]">weight (lbs)</span>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#9CA3AF]">From</span>
                  <input
                    type="date"
                    value={nutritionStartDate}
                    onChange={(e) => setNutritionStartDate(e.target.value)}
                    className="text-xs border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#9CA3AF]">To</span>
                  <input
                    type="date"
                    value={nutritionEndDate}
                    onChange={(e) => setNutritionEndDate(e.target.value)}
                    className="text-xs border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="h-50 w-full">
              {nutritionLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0D9488]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nutritionData} barGap={0} barCategoryGap="40%">
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip />
                    <Bar dataKey="protein" stackId="a" fill="#32A26E" />
                    <Bar dataKey="carbs" stackId="a" fill="#66BBE2" />
                    <Bar dataKey="fats" stackId="a" fill="#FFA350" />
                    <Line type="monotone" dataKey={() => 0} stroke="#9CA3AF" strokeDasharray="3 3" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#32A26E]"></div>
                  <span className="text-[8px] font-bold text-[#9CA3AF]">Protein</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#66BBE2]"></div>
                  <span className="text-[8px] font-bold text-[#9CA3AF]">Carbs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFA350]"></div>
                  <span className="text-[8px] font-bold text-[#9CA3AF]">Fats</span>
                </div>
              </div>
            </div>
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

            <div className="h-50 w-full">
              {sleepLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0D9488]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sleepData}>
                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C8F2C8" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.15} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} dy={10} />
                    <YAxis hide domain={[0, 10]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="hours" stroke="#C8F2C8" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#sleepGradient)" />
                    <Line type="monotone" dataKey={() => 7.5} stroke="#9CA3AF" strokeDasharray="3 3" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
