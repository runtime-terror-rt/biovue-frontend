"use client";

import { Archive } from "lucide-react";
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
  CartesianGrid
} from "recharts";

// --- Define Types ---
interface ChartCardProps {
  title: string;
  subtitle: string;
  total?: string;
  totalLabel?: string;
  children: ReactNode;
}

interface ChartsNutritionProps {
  data?: any[];
  isLoading?: boolean;
}

// --- ChartCard Component ---
export const ChartCard = ({
  title,
  subtitle,
  total,
  totalLabel,
  children,
}: ChartCardProps) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-4 group hover:border-[#3A86FF]/20 transition-all">
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F3F8FF] flex items-center justify-center group-hover:bg-[#3A86FF] transition-colors">
            <Archive size={16} className="text-[#3A86FF] group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-[#1F2D2E]">{title}</h3>
        </div>
        <p className="text-[10px] text-[#5F6F73] mt-1">{subtitle}</p>
      </div>
      {total && (
        <div className="text-right">
          <p className="text-[#5F6F73] text-[10px] font-medium">{totalLabel}</p>
          <p className="text-[#10B981] font-bold text-sm tracking-tight">{total}</p>
        </div>
      )}
    </div>
    <div className="mt-2 h-50 w-full">{children}</div>
  </div>
);

export default function ChartsNutrition({ data = [], isLoading }: ChartsNutritionProps) {
  // Memoize data transformations
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
      calories: (item.nutrition?.protein || 0) * 4 + (item.nutrition?.carbs || 0) * 4 + (item.nutrition?.fats || 0) * 9
    }));
  }, [data]);

  // Calculate total progress (weight diff) if data exists
  const weightProgress = useMemo(() => {
    const validWeights = data?.filter(d => d.weight !== null && d.weight !== undefined) || [];
    if (validWeights.length < 2) return null;
    const diff = validWeights[validWeights.length - 1].weight - validWeights[0].weight;
    return `${diff > 0 ? "+" : ""}${diff.toFixed(1)} lbs`;
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-50">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-72 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center">
            <Archive size={24} className="text-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Weight Progress"
          subtitle="Real-time biological mass tracking"
          total={weightProgress || "-- lbs"}
          totalLabel="Period Progress"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3A86FF" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3A86FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                interval={chartData.length > 30 ? 6 : chartData.length > 7 ? 3 : 0}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1F2D2E' }}
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

        <ChartCard
          title="Activity Trends"
          subtitle="Biological kinetic output (Steps)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                interval={chartData.length > 30 ? 6 : chartData.length > 7 ? 3 : 0}
              />
              <Tooltip 
                cursor={{ fill: "#F8FAFC" }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="steps" fill="#0FA4A9" radius={[6, 6, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Nutrition Overview"
          subtitle="Macronutrient distribution analysis"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                interval={chartData.length > 30 ? 6 : chartData.length > 7 ? 3 : 0}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                formatter={(value: any, name: any) => {
                  const labels: any = { p: "Protein", c: "Carbs", f: "Fats" };
                  return [`${value}g`, labels[name] || name];
                }}
              />
              <Bar dataKey="p" stackId="a" fill="#3A86FF" radius={[0, 0, 0, 0]} />
              <Bar dataKey="c" stackId="a" fill="#10B981" />
              <Bar dataKey="f" stackId="a" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Sleep Patterns"
          subtitle="Restoration and recovery monitoring"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                interval={chartData.length > 30 ? 6 : chartData.length > 7 ? 3 : 0}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
