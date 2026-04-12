"use client";

import ProgramView from "../../../../../components/TrainerDashboard/programs/ProgramView";
import { useParams } from "next/navigation";

import { Loader2 } from "lucide-react";
import { useGetProgramByIdQuery } from "@/redux/features/api/TrainerDashboard/Program/GetProgramById";
import { useGetAssignedUsersQuery } from "@/redux/features/api/TrainerDashboard/Program/GetAssignedUsers";
import { AssignedUser } from "@/redux/features/api/TrainerDashboard/Program/AssignProgram";

export default function ProgramDetailsPage() {
  const params = useParams();
  const programId = Number(params.programId);

  const { data, isLoading, isError } = useGetProgramByIdQuery(programId);
  const { data: assignedUsersData } = useGetAssignedUsersQuery(programId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return <div className="p-6 text-red-600">Program not found.</div>;
  }

  const program = data.data;

  // Map ProgramUser to AssignedUser format
  const mappedUsers: AssignedUser[] = (assignedUsersData?.users || []).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image_url: user.profile_image,
    pivot: {
      program_set_id: programId,
      user_id: user.id,
    },
  }));

  return (
    <ProgramView
      program={{
        id: String(program.id),
        name: program.name,
        duration: `${program.duration} weeks`,
        primaryGoal: program.primary_goal,
        intensity: program.target_intensity,
        focusCount: program.focus_areas?.length ?? 0,
        habitFocus: program.habit_focus ?? [],
        programFocus: program.program_focus ?? [],
        wellnessMacros: {
          calories: program.calories ?? 0,
          protein: program.protein ?? 0,
          carbs: program.carbs ?? 0,
          fat: program.fat ?? 0,
        },
        supplements: program.supplement_recommendation ?? [],
        users: mappedUsers,
      }}
    />
  );
}
