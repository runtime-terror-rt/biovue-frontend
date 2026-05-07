"use client";

import { useGetProgramsQuery } from "@/redux/features/api/userDashboard/GetPrograms";
import { Loader2, FileText, Calendar, Target, Zap, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AssignedProgramsPage() {
  const { data: response, isLoading, error } = useGetProgramsQuery();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0FA4A9]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        Failed to load programs. Please try again later.
      </div>
    );
  }

  const programs = response?.data || [];

  return (
    <div className=" mx-auto py-8 px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1F2D2E]">
          Your Assigned Programs
        </h1>
        <p className="text-[#5F6F73]">
          View the training programs assigned to you by your trainer.
        </p>
      </div>

      {programs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-semibold text-[#1F2D2E]">
            No Programs Assigned
          </h3>
          <p className="text-[#5F6F73] max-w-xs mx-auto mt-2">
            You don&apos;t have any programs assigned yet. Check back later or
            contact your trainer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card
              key={program.program_id}
              className="border-none  bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all overflow-hidden group"
            >
              <div className="h-2 w-full bg-[#0FA4A9] opacity-10 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start py-4 mb-2">
                  <Badge className="bg-[#E4EFFF] text-[#3A86FF] hover:bg-[#E4EFFF] border-none px-3 font-medium">
                    ACTIVE
                  </Badge>
                  <span className="text-[11px] text-[#9AAEB2] font-medium flex items-center gap-1">
                    Assigned on:
                    <Calendar size={12} />
                    {new Date(program.assigned_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-[#1F2D2E] leading-tight">
                  {program.program_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-widest">
                      GOAL
                    </span>
                    <div className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <Target size={14} className="text-[#3A86FF]" />
                      </div>
                      {program.primary_goal}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-widest">
                      INTENSITY
                    </span>
                    <div className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                      <div className="p-1.5 bg-orange-50 rounded-md">
                        <Zap size={14} className="text-[#F59E0B]" />
                      </div>
                      {program.target_intensity}
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-50 flex pb-4 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-[#0FA4A9]">
                      <User size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-widest leading-none mb-1">
                        TRAINER(Assigned By)
                      </span>
                      <span className="text-sm font-bold text-[#1F2D2E]">
                        {program.created_by}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-widest leading-none mb-1 block">
                      DURATION
                    </span>
                    <span className="text-sm font-extrabold text-[#3A86FF]">
                      {program.duration} WEEKS
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
