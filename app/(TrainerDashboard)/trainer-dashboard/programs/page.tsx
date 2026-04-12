"use client";

import { useState, useMemo } from "react";
import DashboardHeading from "../../../../components/common/DashboardHeading";
import StatCards from "../../../../components/TrainerDashboard/programs/StatCard";
import { Funnel, Plus, ArrowDownUp, Loader2 } from "lucide-react";
import ProgramsTable from "../../../../components/TrainerDashboard/programs/ProgramsTable";
import CreateProgramModal from "../../../../components/TrainerDashboard/programs/CreateProgramsModal";
import { useGetProgramsQuery, Program } from "../../../../redux/features/api/TrainerDashboard/Program/GetPrograms";

export default function ProgramsPage() {
  const { data, isLoading } = useGetProgramsQuery();
  const programs: Program[] = data?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Most Recent Activity");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const sortOptions = [
    "Most Recent Activity",
    ...Array.from(new Set(programs.map((p) => p.primary_goal))).filter(Boolean),
  ];

  // Filter and sort programs based on search and sort
  const filteredPrograms = useMemo(() => {
    let result = [...programs];

    // Search by name
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(lower));
    }

    // Sort or Filter by Goal
    if (sortOption === "Most Recent Activity") {
      result = result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else {
      result = result.filter((p) => p.primary_goal === sortOption);
    }

    return result;
  }, [programs, searchTerm, sortOption]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5 md:space-y-10">
      {/* header */}
      <div className="flex items-start justify-between">
        <DashboardHeading
          heading="Programs"
          subheading="Create, manage, and assign coaching programs to your clients"
        />
        <div className="mb-6 flex justify-end items-center">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            <Plus size={18} />
            Create Program
          </button>
        </div>
      </div>

      <StatCards />

      {/* Filters and search bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-50 px-4 py-2 border bg-white rounded w-full max-w-sm focus:ring-2 focus:ring-teal-500"
        />

        {/* Sort Dropdown */}
        <div className="relative bg-white">
          <button
            onClick={() => {
              setShowSortDropdown(!showSortDropdown);
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 bg-white"
          >
            <ArrowDownUp size={16} className="text-[#5F6F73]" />
            {sortOption}
          </button>
          {showSortDropdown && (
            <div className="absolute mt-2 w-52 bg-white border border-gray-300 rounded-lg shadow-lg z-10 right-0">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortOption(option);
                    setShowSortDropdown(false);
                  }}
                  className="w-full cursor-pointer px-4 py-2.5 text-left text-sm flex justify-between items-center hover:bg-gray-100"
                >
                  {option}
                  {sortOption === option && (
                    <svg
                      className="w-5 h-5 text-[#0D9488]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProgramsTable programs={filteredPrograms} />

      <CreateProgramModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
