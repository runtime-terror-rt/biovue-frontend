"use client";

import {
  Archive,
  Droplets,
  Frown,
  Activity,
  Moon,
  Scale,
  Utensils,
} from "lucide-react";
import { ReactNode, useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

// --- Define Types ---
interface ChartCardProps {
  title: string;
  subtitle: string;
  total?: string;
  totalLabel?: string;
  icon?: ReactNode;
  iconBg?: string;
  children: ReactNode;
}

interface ChartsNutritionProps {
  data?: any[];
  stressData?: any;
  hydrationData?: any;
  isLoading?: boolean;
  isStressLoading?: boolean;
  isHydrationLoading?: boolean;
}

// --- ChartCard Component ---
export const ChartCard = ({
  title,
  subtitle,
  total,
  totalLabel,
  icon,
  iconBg,
  children,
}: ChartCardProps) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-4 group hover:border-[#3A86FF]/20 transition-all">
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              iconBg || "bg-[#F3F8FF] text-[#3A86FF] group-hover:bg-[#3A86FF] group-hover:text-white",
            )}
          >
            {icon || <Archive size={16} />}
          </div>
          <h3 className="text-sm font-bold text-[#1F2D2E]">{title}</h3>
        </div>
        <p className="text-[10px] text-[#5F6F73] mt-1">{subtitle}</p>
      </div>
      {total && (
        <div className="text-right">
          <p className="text-[#5F6F73] text-[10px] font-medium">{totalLabel}</p>
          <p className="text-[#10B981] font-bold text-sm tracking-tight">
            {total}
          </p>
        </div>
      )}
    </div>
    <div className="mt-2 h-50 w-full">{children}</div>
  </div>
);

export default function ChartsNutrition({
  data = [],
  stressData,
  hydrationData,
  isLoading,
  isStressLoading,
  isHydrationLoading,
}: ChartsNutritionProps) {
  // Memoize data transformations for base overview charts
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item: any) => ({
      name: item.label,
      weight: item.weight || 0,
      steps: item.steps || 0,
      sleep: item.sleep_hours || 0,
      p: item.nutrition?.protein || 0,
      c: item.nutrition?.carbs || 0,
      f: item.nutrition?.fats || 0,
      calories:
        (item.nutrition?.protein || 0) * 4 +
        (item.nutrition?.carbs || 0) * 4 +
        (item.nutrition?.fats || 0) * 9,
    }));
  }, [data]);

  // Calculate total progress (weight diff) if data exists
  const weightProgress = useMemo(() => {
    const validWeights =
      data?.filter((d) => d.weight !== null && d.weight !== undefined) || [];
    if (validWeights.length < 2) return null;
    const diff =
      validWeights[validWeights.length - 1].weight - validWeights[0].weight;
    return `${diff > 0 ? "+" : ""}${diff.toFixed(1)} lbs`;
  }, [data]);

  // Transform Hydration Data
  const hydrationChartData = useMemo(() => {
    const rawList =
      hydrationData?.data?.chart_data ||
      hydrationData?.chart_data ||
      hydrationData?.hydration?.chart_data ||
      hydrationData?.hydration?.chart ||
      [];
    if (Array.isArray(rawList)) {
      return rawList.map((item: any) => ({
        name: item.label || item.day || item.name || item.date || "",
        water_oz: Number(
          item.water_oz ??
            item.ounces ??
            item.val ??
            item.value ??
            (item.glasses ? item.glasses * 8 : 0),
        ),
        glasses: Number(
          item.glasses ??
            (item.water_oz ? (item.water_oz / 8).toFixed(1) : 0),
        ),
      }));
    }
    return [];
  }, [hydrationData]);

  const hydrationAvg =
    hydrationData?.data?.statistics?.average_water ||
    hydrationData?.statistics?.average_water ||
    hydrationData?.hydration?.average ||
    (hydrationChartData.length > 0
      ? `${(
          hydrationChartData.reduce((acc, curr) => acc + curr.water_oz, 0) /
          hydrationChartData.length
        ).toFixed(1)} oz`
      : undefined);

  // Transform Stress Data
  const stressChartData = useMemo(() => {
    const rawList =
      stressData?.chart_data ||
      stressData?.data?.chart_data ||
      stressData?.data ||
      [];
    if (Array.isArray(rawList)) {
      return rawList.map((item: any) => ({
        name: item.day || item.label || item.name || item.date || "",
        date: item.date || "",
        stress: Number(item.stress_level ?? item.stress ?? item.val ?? 0),
        mood: item.mood || "neutral",
      }));
    }
    return [];
  }, [stressData]);

  const stressAvg =
    stressData?.stats?.average ||
    stressData?.data?.stats?.average ||
    (stressChartData.length > 0
      ? `${(
          stressChartData.reduce((acc, curr) => acc + curr.stress, 0) /
          stressChartData.length
        ).toFixed(1)}/10`
      : undefined);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-72 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center"
          >
            <Archive size={24} className="text-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Weight Progress */}
        <ChartCard
          title="Weight Progress"
          subtitle="Real-time biological mass tracking"
          total={weightProgress || "-- lbs"}
          totalLabel="Period Progress"
          icon={<Scale size={16} />}
          iconBg="bg-blue-50 text-[#3A86FF]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3A86FF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3A86FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                interval={
                  chartData.length > 30 ? 6 : chartData.length > 7 ? 3 : 0
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#1F2D2E" }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#3A86FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorWeight)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Activity Trends */}
        <ChartCard
          title="Activity Trends"
          subtitle="Biological kinetic output (Steps)"
          icon={<Activity size={16} />}
          iconBg="bg-teal-50 text-[#0FA4A9]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                interval={
                  chartData.length > 30 ? 6 : chartData.length > 7 ? 3 : 0
                }
              />
              <Tooltip
                cursor={{ fill: "#F8FAFC" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              />
              <Bar
                dataKey="steps"
                fill="#0FA4A9"
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Nutrition Overview */}
        <ChartCard
          title="Nutrition Overview"
          subtitle="Macronutrient distribution analysis"
          icon={<Utensils size={16} />}
          iconBg="bg-emerald-50 text-[#10B981]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                interval={
                  chartData.length > 30 ? 6 : chartData.length > 7 ? 3 : 0
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
                formatter={(value: any, name: any) => {
                  const labels: any = { p: "Protein", c: "Carbs", f: "Fats" };
                  return [`${value}g`, labels[name] || name];
                }}
              />
              <Bar
                dataKey="p"
                stackId="a"
                fill="#3A86FF"
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="c" stackId="a" fill="#10B981" />
              <Bar
                dataKey="f"
                stackId="a"
                fill="#F59E0B"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Sleep Patterns */}
        <ChartCard
          title="Sleep Patterns"
          subtitle="Restoration and recovery monitoring"
          icon={<Moon size={16} />}
          iconBg="bg-purple-50 text-[#8B5CF6]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                interval={
                  chartData.length > 30 ? 6 : chartData.length > 7 ? 3 : 0
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
                formatter={(value: any) => [`${value} hrs`, "Sleep Duration"]}
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#8B5CF6",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Hydration Trends */}
        <ChartCard
          title="Hydration Trends"
          subtitle="Daily fluid intake monitoring"
          total={hydrationAvg}
          totalLabel="Average Intake"
          icon={<Droplets size={16} />}
          iconBg="bg-sky-50 text-[#0284C7]"
        >
          {isHydrationLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hydrationChartData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                  interval={
                    hydrationChartData.length > 30
                      ? 6
                      : hydrationChartData.length > 7
                      ? 3
                      : 0
                  }
                />
                <Tooltip
                  cursor={{ fill: "#F0F9FF" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  formatter={(value: any) => [
                    `${value} oz (≈ ${(Number(value) / 8).toFixed(1).replace(/\.0$/, "")} glasses)`,
                    "Water Intake",
                  ]}
                />
                <Bar
                  dataKey="water_oz"
                  fill="#0284C7"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 6. Stress & Mood */}
        <ChartCard
          title="Stress & Mood"
          subtitle="Daily stress level & mood tracking"
          total={stressAvg}
          totalLabel="Average Score"
          icon={<Frown size={16} />}
          iconBg="bg-amber-50 text-[#F59E0B]"
        >
          {isStressLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stressChartData}>
                <defs>
                  <linearGradient
                    id="colorStressProgress"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                  interval={
                    stressChartData.length > 30
                      ? 6
                      : stressChartData.length > 7
                      ? 3
                      : 0
                  }
                />
                <YAxis domain={[0, 10]} hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  formatter={(value: any, _name: any, item: any) => [
                    `${value}/10 ${item?.payload?.mood ? `(Mood: ${item.payload.mood})` : ""}`,
                    "Stress Level",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="stress"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorStressProgress)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
