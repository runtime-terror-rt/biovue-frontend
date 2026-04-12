"use client";

import DashboardHeading from "@/components/common/DashboardHeading";
import Actions from "@/components/TrainerDashboard/overview/Actions";
import Clients from "@/components/TrainerDashboard/overview/Clients";
import RecentActivity from "@/components/TrainerDashboard/overview/RecentActivities";
import StatCards from "@/components/TrainerDashboard/overview/StatCard";
import { useGetTrainerOverviewQuery } from "@/redux/features/api/TrainerDashboard/trainerOverviewApi";

export default function TrainerOverviewPage() {
  const { data, isLoading } = useGetTrainerOverviewQuery();

  return (
    <div className="min-h-screen ">
      <div className="mb-4 md:mb-8">
        <DashboardHeading
          heading="Overview"
          subheading="Your coaching activity at a glance"
        />
      </div>
      <div className="space-y-5 md:space-y-10">
        <StatCards stats={data?.stats} isLoading={isLoading} />
        <Clients clients={data?.client_table} isLoading={isLoading} />
        <Actions />
        <RecentActivity />
      </div>
    </div>
  );
}
