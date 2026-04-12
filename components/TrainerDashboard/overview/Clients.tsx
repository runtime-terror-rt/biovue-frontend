import { Button } from "@/components/ui/button";
import ClientsTable from "../Clients/ClientsTable";
import DashboardHeading from "@/components/common/DashboardHeading";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { clients as allClients, Client } from "./data";
import { ClientTableItem } from "@/redux/features/api/TrainerDashboard/trainerOverviewApi";

interface ClientsProps {
  clients?: ClientTableItem[];
  isLoading?: boolean;
}

export default function Clients({ clients: apiClients, isLoading }: ClientsProps) {
  // Use API data if available, otherwise default to empty array
  const displayClients = apiClients || [];

  return (
    <div className="bg-white">
      <div className=" p-5 flex justify-between items-center">
        <div>
          <DashboardHeading
            heading="Clients"
            subheading=" Based on recent activity and progress trends"
          />
        </div>
        <Link href="/trainer-dashboard/clients">
          <Button variant="link" className="text-[#0FA4A9] cursor-pointer">
            View All <ChevronRight />
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="p-5 space-y-4 animate-pulse">
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
        </div>
      ) : (
        <ClientsTable clients={displayClients} limit={4} />
      )}
    </div>
  );
}
