"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ChevronLeft, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { useGetProgramsQuery } from "@/redux/features/api/TrainerDashboard/Program/GetPrograms";
import { useGetClientProgramContextQuery } from "@/redux/features/api/TrainerDashboard/Clients/ClientOverview";
import { useAssignProgramUsersMutation } from "@/redux/features/api/TrainerDashboard/Program/AssignProgram";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import HealthHabitOverview from "./sections/HealthHabitOverview";
import CoachSetGoals from "./sections/CoachSetGoals";
import CoachActions from "./sections/CoachActions";
import ProgressTrends from "./sections/ProgressTrends";
import CoachNotes from "./sections/CoachNotes";
import VisibilityControls from "./sections/ProgressSettings";

import { ClientDetails } from "../overview/data";

export default function ClientDetailsContent({
  clientDetails,
}: {
  clientDetails: ClientDetails;
}) {
  const statusConfig = {
    "on-track": "bg-[#22C55E1A] text-[#22C55E]",
    "need-attention": "bg-[#D3BB5B1A] text-[#D3BB5B]",
    inactive: "bg-[#9AAEB24D] text-[#5F6F73]",
  };

  const { data: programsData, isLoading: programsLoading } =
    useGetProgramsQuery();
  const { data: programContextData, isLoading: isProgramContextLoading } =
    useGetClientProgramContextQuery(clientDetails.id);
  const [assignProgram, { isLoading: isAssigning }] =
    useAssignProgramUsersMutation();
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");

  const programContext = programContextData?.data;

  const handleAssignProgram = async () => {
    if (!selectedProgramId) {
      toast.error("Please select a program");
      return;
    }

    try {
      const response = await assignProgram({
        program_set_id: Number(selectedProgramId),
        user_ids: [clientDetails.id],
      }).unwrap();

      if (response.status) {
        toast.success(
          response.message || "Client assigned to program successfully",
        );
      } else {
        toast.error(response.message || "Failed to assign program");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "An error occurred while assigning program",
      );
    }
  };

  return (
    <div className="min-h-screen space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium text-[#111827]">
              {clientDetails.name}
            </h1>
            <Badge
              className={`${statusConfig[clientDetails.status]} border-none font-medium capitalize py-0.5 px-2 text-base `}
            >
              {clientDetails.status.replace("-", " ")}
            </Badge>
          </div>
          <p className="text-lg text-[#6B7280] font-medium">
            {clientDetails.connectedDate}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/trainer-dashboard/clients"
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors text-sm font-medium mr-4"
          >
            <ChevronLeft size={16} />
            Back
          </Link>
          <button className="flex items-center gap-2 bg-[#0D9488] text-white px-4 py-3 cursor-pointer rounded-lg text-sm font-semibold hover:bg-[#0A7A6F] transition-colors">
            <MessageSquare size={16} />
            Message Client
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-xs bg-white">
          <CardContent className="p-5 space-y-4">
            <p className="text-base mb-2 font-bold text-[#5F6F73] tracking-wider uppercase">
              PRIMARY GOAL
            </p>
            <div className="space-y-1">
              <h3 className="text-xl md:text-[28px] mb-2 font-medium text-[#111827]">
                {isProgramContextLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  programContext?.primary_goal || "N/A"
                )}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xs bg-white">
          <CardContent className="p-5 space-y-4">
            <p className="text-base mb-2 font-bold text-[#5F6F73] tracking-wider uppercase">
              PROGRAM NAME
            </p>
            <div className="space-y-1">
              <h3 className="text-xl md:text-[28px] mb-2 font-medium text-[#111827] truncate">
                {isProgramContextLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  programContext?.program_name || "N/A"
                )}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xs bg-white">
          <CardContent className="p-5 space-y-4">
            <p className="text-base mb-2 font-bold text-[#5F6F73] tracking-wider uppercase">
              DURATION
            </p>
            <div className="space-y-1">
              <h3 className="text-xl md:text-[28px] mb-2 font-medium text-[#111827]">
                {isProgramContextLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  programContext?.duration || "N/A"
                )}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xs bg-white">
          <CardContent className="p-5 space-y-4">
            <p className="text-base mb-2 font-bold text-[#5F6F73] tracking-wider uppercase">
              INTENSITY
            </p>
            <div className="space-y-1">
              <h3 className="text-xl md:text-[28px] mb-2 font-medium text-[#111827]">
                {isProgramContextLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  programContext?.intensity || "N/A"
                )}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Assignment / Projection Usage */}
      <div className="flex flex-wrap gap-4">
        {/* Projection Usage */}
        <Card className="w-fit border-none shadow-xs bg-white">
          <CardContent className="p-5 space-y-4">
            <p className="text-base mb-2 font-bold text-[#5F6F73] tracking-wider uppercase">
              Projection Usage
            </p>
            <div className="space-y-1">
              <h3 className="text-base font-medium text-[#111827]">
                Used: {clientDetails.projectionUsage.used}/
                {clientDetails.projectionUsage.total}
              </h3>
              <p className="text-sm text-[#5F6F73]">
                Next reset: {clientDetails.projectionUsage.nextResetDays} days
              </p>
              <p className="text-base text-[#22C55E] font-medium whitespace-nowrap">
                Last projection:{" "}
                {clientDetails.projectionUsage.lastProjectionDaysAgo} days ago
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Program Assignment */}
        <Card className="flex-1 min-w-75 border-none shadow-xs bg-white">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-base mb-2 font-bold text-[#5F6F73] tracking-wider uppercase">
                CONNECTED PROGRAM
              </p>
              {programContext?.program_name && (
                <Badge className="bg-[#0D94881A] text-[#0D9488] border-none font-medium">
                  ACTIVE
                </Badge>
              )}
            </div>

            {programContext?.program_name ? (
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-50 rounded-lg text-[#0D9488]">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111827]">
                    {programContext.program_name}
                  </h3>
                  <p className="text-sm text-[#5F6F73]">
                    {programContext.duration} • {programContext.primary_goal}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#5F6F73]">
                No program connected yet. Assign one to help the client reach
                their goals.
              </p>
            )}

            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={selectedProgramId}
                    onValueChange={setSelectedProgramId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programsLoading ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="animate-spin h-4 w-4" />
                        </div>
                      ) : programsData?.data && programsData.data.length > 0 ? (
                        programsData.data.map((program) => (
                          <SelectItem
                            key={program.id}
                            value={program.id.toString()}
                          >
                            {program.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No programs found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={handleAssignProgram}
                  disabled={isAssigning || !selectedProgramId}
                  className="bg-[#0D9488] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0A7A6F] transition-colors disabled:opacity-50"
                >
                  {isAssigning ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Assign"
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          <HealthHabitOverview clientDetails={clientDetails} />
          <CoachSetGoals
            goals={clientDetails.coachSetGoals}
            clientDetails={clientDetails}
          />
          <CoachActions />
          <ProgressTrends clientId={clientDetails.id as any} />
          <CoachNotes notes={clientDetails.coachNotes} />
          <VisibilityControls />
        </div>

        {/* Sidebar */}
      </div>
    </div>
  );
}
