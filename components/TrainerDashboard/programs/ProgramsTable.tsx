"use client";

import { useState, useEffect } from "react";
import { Program } from "../../../redux/features/api/TrainerDashboard/Program/GetPrograms";
import { useRouter } from "next/navigation";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useDeleteProgramMutation } from "@/redux/features/api/TrainerDashboard/Program/DeleteProgram";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProgramsTableProps {
  programs: Program[];
  limit?: number;
  itemsPerPage?: number;
}

export default function ProgramsTable({
  programs,
  limit,
  itemsPerPage = 8,
}: ProgramsTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteProgram] = useDeleteProgramMutation();

  const pageSize = itemsPerPage || 8;
  const totalPages = Math.max(1, Math.ceil(programs.length / pageSize));

  // Reset to page 1 if current page becomes invalid due to filter/data changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [programs.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const visiblePrograms = limit
    ? programs.slice(0, limit)
    : programs.slice(startIndex, startIndex + pageSize);

  const from = programs.length === 0 ? 0 : startIndex + 1;
  const to = Math.min(startIndex + pageSize, programs.length);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

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
      return "bg-[#3A86FF26] text-[#3A86FF] px-3 py-1 rounded-full text-sm font-medium";
    }
    return "bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium";
  };

  return (
    <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg bg-white shadow-sm">
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
              Updated
            </th>
            <th className="px-6 py-4 text-left text-base font-semibold text-[#111827] uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {visiblePrograms.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-12 text-center text-sm text-[#5F6F73]"
              >
                No programs found.
              </td>
            </tr>
          ) : (
            visiblePrograms.map((program) => (
              <tr
                key={program.id}
                className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
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
                  {new Date(program.updated_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewClick(program)}
                      className="text-sm hover:opacity-80 cursor-pointer font-semibold text-[#111827] transition-opacity"
                      title="View Program"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="text-sm hover:opacity-80 cursor-pointer font-semibold text-[#d20000] transition-opacity"
                      title="Delete Program"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {!limit && programs.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-white">
          <span className="text-xs sm:text-sm text-[#5F6F73]">
            Showing <span className="font-semibold text-[#111827]">{from}</span>{" "}
            to <span className="font-semibold text-[#111827]">{to}</span> of{" "}
            <span className="font-semibold text-[#111827]">{programs.length}</span>{" "}
            programs
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 sm:px-3 sm:py-1.5 flex items-center justify-center gap-1 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-[#5F6F73] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="px-2 text-xs text-gray-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center",
                      currentPage === p
                        ? "bg-[#0FA4A9] text-white shadow-sm shadow-[#0FA4A9]/30"
                        : "text-[#5F6F73] border border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 sm:px-3 sm:py-1.5 flex items-center justify-center gap-1 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-[#5F6F73] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
