"use client";

import DashboardHeading from "@/components/common/DashboardHeading";
import StatCard from "@/components/AdminDashboard/Reports/StatCard";
import PlanTable from "@/components/AdminDashboard/Reports/PlanTable";
import Graphs from "@/components/AdminDashboard/Reports/Graphs";
import { Book, Download, Loader2, X } from "lucide-react";
import { useState } from "react";
import { mockData } from "@/components/AdminDashboard/Reports/data";
import { useGetReportsQuery } from "@/redux/features/api/adminDashboard/reports";

export default function ReportPage() {
  const [fromDate, setFromDate] = useState("2026-01-01"); // launch date
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const { data, isLoading, isError } = useGetReportsQuery();

  console.log(data, "reports");

  const downloadReport = () => {
    const plansToExport = (data?.plan_table && data.plan_table.length > 0)
      ? data.plan_table
      : [];

    let csvContent = "";
    if (plansToExport.length > 0) {
      const headers = ["Plan Name", "Plan Type", "Active Subscribers", "Monthly Revenue", "Churn Percentage"];
      const rows = plansToExport.map((p) => [
        `"${p.name || ""}"`,
        `"${p.plan_type || ""}"`,
        p.active_subscribers || 0,
        `"$${p.monthly_revenue || 0}"`,
        `"${p.churn_percentage || "0%"}"`,
      ].join(","));
      csvContent = [headers.join(","), ...rows].join("\n");
    } else {
      // Fallback to basic stats export
      const statsHeaders = ["Metric", "Value"];
      const statsRows = Object.entries(data?.stats || {}).map(
        ([k, v]) => `"${k}","${v}"`,
      );
      csvContent = [statsHeaders.join(","), ...statsRows].join("\n");
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `biovue_report_${fromDate}_to_${toDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]  space-y-4">
        <Loader2 className="w-10 h-10 text-[#0FA4A9] animate-spin" />
        <p className="text-gray-500 animate-pulse font-medium">
          Loading platform reports...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-red-50 rounded-2xl border border-red-100">
        <div className="bg-red-100 p-3 rounded-full mb-4">
          <X size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Failed to load reports
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We encountered an error while fetching the platform statistics. Please
          try refreshing the page.
        </p>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-10">
      <DashboardHeading
        heading="Reports"
        subheading="View and manage all platform reports"
      />

      {/* Stat Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Signups"
          value={stats?.total_signups || "0"}
          description="All registered users"
        />
        <StatCard
          label="Total Subscriptions"
          value={stats?.total_subscriptions || "0"}
          description="Paid subscriptions"
        />
        <StatCard
          label="Total Revenue"
          value={stats?.total_revenue || "$0"}
          description="Lifetime revenue"
        />
        <StatCard
          label="Churn Rate"
          value={stats?.churn_rate || "0%"}
          description="Monthly churn"
        />
        <StatCard
          label="Website Visits"
          value={stats?.website_visits || "0"}
          description="Last 30 days"
        />
        <StatCard
          label="App Visits"
          value={stats?.app_visits || "0"}
          description="Last 30 days"
        />
        <StatCard
          label="Projections Used (Individual)"
          value={stats?.projections_individual || "0"}
          description="Platform usage"
        />
        <StatCard
          label="Projections Used (Professional)"
          value={stats?.projections_professional || "0"}
          description="Platform usage"
        />
      </div>

      {/* Plan Table */}
      <PlanTable data={data?.plan_table} />

      {/* Charts */}
      <Graphs data={data?.charts} />

      {/* Download Report Section */}
      <div className="bg-[#0FA4A90D] rounded-lg border border-[#0D9488] p-6 flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#8746E726] rounded-xl p-3">
            <Book className="w-6 h-6 text-[#8746E7]" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              Download Summary Report
            </h3>
            <p className="text-sm text-gray-600">
              Download summarized report data for offline analysis.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Filters */}
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <input
              type="date"
              className="px-3 py-2 border rounded-md text-sm"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate}
            />
            <input
              type="date"
              className="px-3 py-2 border rounded-md text-sm"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate}
            />
          </div>
          <button
            onClick={downloadReport}
            className="bg-[#0D9488] w-full md:w-auto hover:opacity-80 text-xs cursor-pointer text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
