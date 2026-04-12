"use client";

import { Program } from "../../../redux/features/api/TrainerDashboard/Program/GetPrograms";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import { useDeleteProgramMutation } from "@/redux/features/api/TrainerDashboard/Program/DeleteProgram";
import { toast } from "sonner";

interface ProgramsTableProps {
  programs: Program[];
}

export default function ProgramsTable({ programs }: ProgramsTableProps) {
  const router = useRouter();
  const [deleteProgram] = useDeleteProgramMutation();

  const handleViewClick = (program: Program) => {
    router.push(`/trainer-dashboard/programs/${program.id}`);
  };

  const handleDelete = (id: number) => {
    toast("Are you sure you want to delete this program?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteProgram(id).unwrap();
            toast.success("Program deleted successfully");
          } catch (error) {
            console.error(error);
            toast.error("Failed to delete program");
          }
        },
      },
    });
  };

  const getIntensityStyles = (intensity: string) => {
    if (intensity === "Aggressive") {
      return "text-[#C73434] bg-[#C73434]/5 px-3 py-1 rounded-full font-medium";
    } else if (intensity === "Light") {
      return "bg-[#3A86FF26] text-[#3A86FF]  px-3 py-1 rounded-full text-sm font-medium";
    }
    return "";
  };

  return (
    <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-white">
            <th className="px-6 py-4 text-left text-base font-semibold text-[#111827] uppercase">
              Program Name
            </th>
            <th className="px-6 py-4 text-left text-base font-semibold text-[#111827] uppercase">
              Primary Goal
            </th>
            <th className="px-6 py-4 text-left text-base font-semibold text-[#111827] uppercase">
              Intensity
            </th>
            <th className="px-6 py-4 text-left text-base font-semibold text-[#111827] uppercase">
              Clients
            </th>

            <th className="px-6 py-4 text-left text-base font-semibold text-[#111827] uppercase">
              Updated
            </th>
            <th className="px-6 py-4 text-left text-base font-semibold text-[#111827] uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr
              key={program.id}
              className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
            >
              <td className="px-6 py-4">
                <div className="text-sm font-semibold text-[#111827]">
                  {program.name}
                </div>
                <div className="text-xs text-[#6B7280]">
                  {program.duration} weeks
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-[#111827]">
                {program.primary_goal}
              </td>
              <td className="px-6 py-4">
                <span className={getIntensityStyles(program.target_intensity)}>
                  {program.target_intensity}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-[#111827]">
                0 CLIENTS
              </td>
              <td className="px-6 py-4 text-sm font-medium text-[#111827]">
                {new Date(program.updated_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewClick(program)}
                    className="text-sm hover:opacity-80 cursor-pointer font-semibold text-[#111827]"
                  >
                    <Eye />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className="text-sm hover:opacity-80 cursor-pointer font-semibold text-[#d20000]"
                  >
                    <Trash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
