"use client";

import DashboardHeading from "@/components/common/DashboardHeading";
import ClientsTable from "@/components/TrainerDashboard/Clients/ClientsTable";
import { useGetTrainerOverviewQuery } from "@/redux/features/api/TrainerDashboard/trainerOverviewApi";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ActiveClientsPage() {
  const { data, isLoading } = useGetTrainerOverviewQuery();
  
  const activeClients = (data?.client_table || []).filter(
    (client) => client.status.toLowerCase().includes("on track") || client.status.toLowerCase() === "on-track"
  );

  return (
    <div className="space-y-6">
      <div className="mb-4 cursor-pointer ">
        <Link
          href="/trainer-dashboard"
          className="flex items-center hover:opacity-80 gap-2"
        >
          <button className="  rounded-lg transition-all">
            <ChevronLeft className="w-5 h-5 cursor-pointer " />
          </button>
          <span>Back to Overview</span>
        </Link>
      </div>
      <DashboardHeading
        heading="Active Clients"
        subheading="Clients currently on track"
      />

      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading active clients...</div>
      ) : (
        <ClientsTable clients={activeClients} />
      )}
    </div>
  );
}
