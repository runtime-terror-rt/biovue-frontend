"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const userGrowthData = [
  { month: "Jan", value: 250 },
  { month: "Feb", value: 150 },
  { month: "mar", value: 1000 },
  { month: "apr", value: 350 },
  { month: "May", value: 500 },
  { month: "Jun", value: 420 },
];

const revenueTrendData = [
  { month: "Jan", value: 8500 },
  { month: "Feb", value: 6000 },
  { month: "mar", value: 34000 },
  { month: "apr", value: 13000 },
  { month: "May", value: 15000 },
  { month: "Jun", value: 13500 },
];

function SingleChart({
  title,
  data,
  color,
}: {
  title: string;
  data: { month: string; value: number }[];
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#F3F4F6] p-5 h-64">
      <p className="text-sm font-semibold mb-6">{title}</p>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
        >
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #F3F4F6",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function OverviewCharts({ userGrowth = [], revenueTrend = [] }: { userGrowth?: any[], revenueTrend?: any[] }) {
  // Map API userGrowth data (month, count) to charts format (month, value)
  const chartUserGrowthData = userGrowth.map(item => ({
    month: item.month,
    value: item.count
  }));

  // Map API revenueTrend data (month, amount/value) to charts format (month, value)
  // Assuming revenueTrend also has a value or amount field
  const chartRevenueTrendData = revenueTrend.map(item => ({
    month: item.month,
    value: item.amount || item.value || 0
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SingleChart title="User Growth" data={chartUserGrowthData} color="#8B5CF6" />
      <SingleChart
        title="Revenue Trend"
        data={chartRevenueTrendData}
        color="#0FA4A9"
      />
    </div>
  );
}
