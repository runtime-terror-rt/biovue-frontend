"use client";

import { AlertCircle, Activity, User } from "lucide-react";
import { Card } from "../../ui/card";
import { useGetProgramsQuery } from "@/redux/features/api/TrainerDashboard/Program/GetPrograms";
import { useRouter } from "next/navigation";

export default function StatCards() {
  const { data, isLoading } = useGetProgramsQuery();
  const router = useRouter();

  const programs = data?.data || [];

  // Total programs
  const totalPrograms = programs.length;

  // Latest program (based on created_at)
  const latestProgram =
    programs.length > 0
      ? [...programs].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0]
      : null;

  const handleLatestClick = () => {
    if (latestProgram) {
      router.push(`/trainer-dashboard/programs/${latestProgram.id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {/* Total Programs */}
      <Card className="p-5 bg-white">
        <div className="flex flex-col items-start gap-4">
          <div className="p-3 w-13 h-13 bg-[#0FA4A926] rounded-lg text-[#0D9488]">
            <Activity className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-medium">
              {isLoading ? "..." : totalPrograms}
            </div>
            <div className="text-lg font-medium">Total Programs</div>
            <div className="text-base text-[#5F6F73]">
              Currently created programs
            </div>
          </div>
        </div>
      </Card>

      {/* Latest Program */}
      <Card
        className="p-5 bg-white cursor-pointer hover:shadow-md transition"
        onClick={handleLatestClick}
      >
        <div className="flex flex-col items-start gap-4">
          <div className="p-3 w-13 h-13 bg-[#0FA4A926] rounded-lg text-[#0D9488]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="text-xl font-medium">
              {isLoading ? "..." : latestProgram ? "Latest Program" : "N/A"}
            </div>
            <div className="text-lg font-medium">
              {latestProgram?.name || "No Programs"}
            </div>
            <div className="text-base text-[#5F6F73]">
              Click to view details
            </div>
          </div>
        </div>
      </Card>

      {/* Clients (unchanged) */}
      {/* <Card className="p-5 bg-white">
        <div className="flex flex-col items-start gap-4">
          <div className="p-3 w-13 h-13 bg-[#0FA4A926] rounded-lg text-[#0D9488]">
            <User className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-medium">18</div>
            <div className="text-lg font-medium">Clients in Programs</div>
            <div className="text-base text-[#5F6F73]">Active participants</div>
          </div>
        </div>
      </Card> */}
    </div>
  );
}
