"use client";

import  { useEffect } from "react";
import OverviewCharts from "@/components/AdminDashboard/Overview/OverViewCharts";
import PlanSummaryTable from "@/components/AdminDashboard/Overview/PlanSummeryTable";
import StatCard from "@/components/AdminDashboard/Overview/StatCard";

import DashboardHeading from "@/components/common/DashboardHeading";

import { useGetAdminOverviewQuery } from "@/redux/features/api/adminDashboard/overview";

export default function AdminOverviewPage() {
  const { data, isLoading, error } = useGetAdminOverviewQuery({});

  useEffect(() => {
    if (error) {
      console.error("Admin Overview Fetch Error:", error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0FA4A9]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-red-500 gap-4">
        <p className="font-bold text-xl">Failed to load dashboard data</p>
        <p className="text-sm">
          Please ensure you are logged in and the API is accessible.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#0FA4A9] text-white rounded-lg cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const overview = data?.overview || {};
  const charts = data?.charts || {};
  const planSummary = data?.plan_summary || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Page title */}
      <DashboardHeading
        heading="Overview"
        subheading="Your coaching activity at a glance"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Signups"
          value={overview.total_signups?.toString() || "0"}
          sub="All registered users"
        />
        <StatCard
          title="Active Users"
          value={overview.active_users?.toString() || "0"}
          sub="Active in last 30 days"
        />
        <StatCard
          title="Total Subscriptions"
          value={overview.total_subscriptions?.toString() || "0"}
          sub="Paid subscriptions"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value={overview.total_revenue || "$0.00"}
          sub="Lifetime revenue"
        />
        <StatCard
          title="Monthly Revenue"
          value={overview.monthly_revenue || "$0.00"}
          sub="Current month"
        />
        <StatCard
          title="Churn Rate"
          value={overview.churn_rate || "0%"}
          sub="Monthly churn"
        />
      </div>

      {/* Charts */}
      <div className="">
        <OverviewCharts
          userGrowth={charts.user_growth}
          revenueTrend={charts.revenue_trend}
        />
      </div>

      {/* Tables */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full ">
          <PlanSummaryTable data={planSummary} />
        </div>
        {/* <div className="w-full md:w-1/3">
          <SystemStatus />
        </div> */}
      </div>
    </div>
  );
}
