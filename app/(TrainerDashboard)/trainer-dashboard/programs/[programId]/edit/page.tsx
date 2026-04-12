"use client";

import { useParams } from "next/navigation";
import ProgramEdit from "../../../../../../components/TrainerDashboard/programs/ProgramEdit";
import { Loader2 } from "lucide-react";
import { useGetProgramByIdQuery, Program } from "@/redux/features/api/TrainerDashboard/Program/GetProgramById";

function mapProgramToEdit(program: Program) {
  return {
    id: String(program.id),
    name: program.name,
    duration: `${program.duration} weeks`,
    primaryGoal: program.primary_goal,
    intensity: program.target_intensity,
    focusCount: program.focus_areas?.length ?? 0,
    habitFocus: program.habit_focus ?? [],
    programFocus: program.program_focus ?? [],
    weeklyActivityTarget: "4–5 sessions/week",
    wellnessMacros: {
      calories: program.calories ?? 0,
      protein: program.protein ?? 0,
      carbs: program.carbs ?? 0,
      fat: program.fat ?? 0,
    },
    supplements: program.supplement_recommendation ?? [],
    internalNotes: program.notes ?? "",
  };
}

export default function EditProgramPage() {
  const params = useParams();
  const programId = Number(params.programId);

  const { data, isLoading, isError } = useGetProgramByIdQuery(programId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return <div className="p-6 text-red-600">Program not found (ID: {programId})</div>;
  }

  const foundProgram = data.data;
  const program = mapProgramToEdit(foundProgram);

  return <ProgramEdit program={program} />;
}
