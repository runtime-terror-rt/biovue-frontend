"use client";

import DashboardHeading from "@/components/common/DashboardHeading";
import Actions from "@/components/NutritionistDashboard/overview/Actions";
import Clients from "@/components/NutritionistDashboard/overview/Clients";
import StatCards from "@/components/NutritionistDashboard/overview/StatCard";
import { useGetNutritionistOverviewQuery } from "@/redux/features/api/NutritionistDashboard/nutritionistOverviewApi";

export default function NutritionistOverviewPage() {
  const { data, isLoading } = useGetNutritionistOverviewQuery();

  return (
    <div className="min-h-screen ">
      <div className="mb-4 md:mb-8">
        <DashboardHeading
          heading="Overview"
          subheading="Your nutritional coaching activity at a glance"
        />
      </div>
      <div className="space-y-5 md:space-y-10">
        <StatCards stats={data?.stats} isLoading={isLoading} />
        <Clients clients={data?.client_table} isLoading={isLoading} />
        <Actions />
        {/* <RecentActivity /> */}
      </div>
    </div>
  );
}
