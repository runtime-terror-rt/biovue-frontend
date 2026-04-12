"use client";

import {
  CalendarRange,
  Check,
  EditIcon,
  Loader2,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AssignedUser,
  useAssignProgramUsersMutation,
} from "@/redux/features/api/TrainerDashboard/Program/AssignProgram";
import { useGetUsersQuery } from "@/redux/features/api/TrainerDashboard/Program/GetUsersList";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ProgramViewProps {
  program: {
    id: string;
    name: string;
    duration: string;
    primaryGoal: string;
    intensity: string;
    focusCount: number;
    habitFocus: string[];
    programFocus: string[];
    wellnessMacros: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    supplements: string[];
    users: AssignedUser[];
  };
}

export default function ProgramView({ program }: ProgramViewProps) {
  const router = useRouter();

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const [assignUsers, { isLoading: isAssigning }] =
    useAssignProgramUsersMutation();

  const handleViewClick = () => {
    router.push(`/trainer-dashboard/programs`);
  };
  const handleEditClick = () => {
    router.push(`/trainer-dashboard/programs/${program.id}/edit`);
  };

  const supplementOptions = [
    "Protein Powder",
    "Creatine Monohydrate",
    "Omega-3 Fish Oil",
    "Multivitamin",
    "Vitamin D3",
    "Magnesium",
  ];

  const connectedUserIds = program.users.map((u) => u.id);
  const allUsers = usersData?.data || [];
  const handleAddClients = async () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one client");
      return;
    }

    try {
      // const response = await assignUsers({
      //   program_set_id: Number(program.id),
      //   user_ids: selectedUserIds,
      // }).unwrap();
      const response = await assignUsers({
        program_set_id: Number(program.id),
        user_ids: [...connectedUserIds, ...selectedUserIds],
      }).unwrap();
      if (response.status) {
        toast.success(
          response.message || "Clients added to program successfully",
        );
        setSelectedUserIds([]);
      } else {
        toast.error(response.message || "Failed to add clients");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "An error occurred while adding clients",
      );
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  return (
    <div className=" min-h-screen">
      <button
        onClick={handleViewClick}
        className="mb-6 border-2 cursor-pointer rounded-lg border-[#3A86FF25] px-3 py-2 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; Back to Programs
      </button>

      <div className=" border-t-2 pt-5 md:pt-10 border-[#BDBDBD] space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {program.name}
            </h1>
            <div className="text-[#6B7280] flex items-center gap-2 mt-1 text-sm">
              <span className="flex items-center gap-1">
                <CalendarRange size={14} /> {program.duration} •
              </span>
              <span>{program.primaryGoal} •</span>
              <span className="bg-[#F59E0B15] text-[#F59E0B] rounded-full px-2 py-1 font-semibold">
                {program.intensity}
              </span>
              <span> • Created January 15, 2026</span>
            </div>
          </div>
          <button
            onClick={handleEditClick}
            className="px-4 py-2 flex items-center gap-2 cursor-pointer rounded-lg bg-indigo-600 text-white  hover:bg-indigo-700 text-base"
          >
            <EditIcon size={14} /> <span>Edit Program</span>
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl shadow-md space-y-2 bg-white">
            <div className="text-sm text-[#6B7280]">Duration</div>
            <div className="text-xl font-semibold text-gray-900">
              {program.duration}
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-md space-y-2 bg-white">
            <div className="text-sm text-[#6B7280]">Goal</div>
            <div className="text-lg font-semibold text-gray-900">
              {program.primaryGoal}
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-md space-y-2 bg-white">
            <div className="text-sm text-[#6B7280]">Intensity</div>
            <div className="text-lg font-semibold text-yellow-500">
              {program.intensity}
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-md space-y-2 bg-white">
            <div className="text-sm text-[#6B7280]">Focus Count</div>
            <div className="text-lg font-semibold text-gray-900">
              {program.focusCount} Areas
            </div>
          </div>
        </div>

        {/* Habit Focus & Program Focus */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            {/* Habit Focus */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <div className="text-base font-semibold text-black mb-2">
                Habit Focus Areas
              </div>
              <div className="flex flex-wrap gap-2">
                {program.habitFocus.map((habit) => (
                  <span
                    key={habit}
                    className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-sm font-medium"
                  >
                    {habit}
                  </span>
                ))}
              </div>
            </div>
            {/* Program Focus */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <div className="text-base font-semibold text-black mb-2">
                Program Focus
              </div>
              <div className="flex flex-col gap-3">
                {program.programFocus.map((focus) => (
                  <div
                    key={focus}
                    className="flex items-center gap-2 border rounded-md p-4"
                  >
                    <span className="rounded-lg w-6 text-[#6366F1]  bg-[#EEF2FF] text-center h-6 flex items-center">
                      <Check className="" />
                    </span>
                    <span className="text-sm text-gray-900">{focus}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Connected Clients & Add Clients Section */}
            <div className="flex flex-col gap-6 mt-6">
              {/* Connected Clients */}
              <div className="bg-white p-5 rounded-xl shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="text-[#0D9488]" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Connected Clients
                  </h2>
                </div>
                <div className="space-y-3 max-h-70 overflow-y-auto">
                  {program.users.length > 0 ? (
                    program.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                      >
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No clients connected to this program yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Add Clients */}
              <div className="bg-white p-5 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <UserPlus className="text-[#0D9488]" size={20} />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Add Clients to Program
                    </h2>
                  </div>
                  <button
                    onClick={handleAddClients}
                    disabled={isAssigning || selectedUserIds.length === 0}
                    className="bg-[#0D9488] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0A7A6F] transition-colors disabled:opacity-50"
                  >
                    {isAssigning ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Add to Program"
                    )}
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-2">
                  {usersLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="animate-spin text-teal-600" />
                    </div>
                  ) : allUsers.length > 0 ? (
                    allUsers.map((user) => {
                      const isAlreadyAssigned = connectedUserIds.includes(user.id);
                      return (
                        <div
                          key={user.id}
                          className={cn(
                            "flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors",
                            isAlreadyAssigned && "opacity-60 cursor-not-allowed"
                          )}
                          onClick={() => !isAlreadyAssigned && toggleUserSelection(user.id)}
                        >
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={isAlreadyAssigned || selectedUserIds.includes(user.id)}
                            disabled={isAlreadyAssigned}
                            onCheckedChange={() => !isAlreadyAssigned && toggleUserSelection(user.id)}
                          />
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                              {isAlreadyAssigned && (
                                <p className="text-[10px] text-teal-600 font-semibold uppercase">Already Assigned</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 italic text-center p-4">
                      No clients available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {/* Wellness Macros */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <div className="text-base font-semibold text-black mb-2">
                Wellness Macros
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <div className="text-xs font-semibold text-[#92400E]">
                    Calories
                  </div>
                  <div className=" flex flex-col gap-1 text-[#92400E]">
                    <span className="font-bold text-xl md:text-2xl">
                      {program.wellnessMacros.calories}
                    </span>
                    <span className="text-xs font-medium">kcal</span>
                  </div>
                </div>
                <div className="bg-[#DBEAFE] p-4 rounded-lg">
                  <div className="text-xs font-semibold text-[#1E40AF]">
                    Protein
                  </div>
                  <div className="flex flex-col gap-1 text-[#1E40AF]">
                    <span className="font-bold text-xl md:text-2xl">
                      {program.wellnessMacros.protein}
                    </span>
                    <span className="text-xs font-medium">grams</span>
                  </div>
                </div>
                <div className="bg-[#FCE7F3] p-4 rounded-lg">
                  <div className="text-xs font-semibold text-[#9F1239]">
                    Carbs
                  </div>
                  <div className="flex flex-col gap-1 text-[#9F1239]">
                    <span className="font-bold text-xl md:text-2xl">
                      {program.wellnessMacros.carbs}
                    </span>
                    <span className="text-xs font-medium">grams</span>
                  </div>
                </div>
                <div className="bg-[#D1FAE5] p-4 rounded-lg">
                  <div className="text-xs font-semibold text-[#065F46]">
                    Fat
                  </div>

                  <div className="flex flex-col gap-1 text-[#065F46]">
                    <span className="font-bold text-xl md:text-2xl">
                      {program.wellnessMacros.fat}
                    </span>
                    <span className="text-xs font-medium">grams</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplements */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <div className="text-base font-semibold text-black mb-4">
                Supplement Recommendations
              </div>
              <div className="flex flex-col gap-2">
                {supplementOptions.map((supp) => (
                  <div
                    key={supp}
                    className={`flex items-center gap-2 p-3 rounded ${
                      program.supplements.includes(supp)
                        ? "bg-[#F0FDF4] text-[#111827]"
                        : "bg-[#F9FAFB] text-[#6B7280]"
                    }`}
                  >
                    {program.supplements.includes(supp) && (
                      <Check className="w-4 h-4 bg-[#10B981] text-white" />
                    )}
                    <span className="text-sm">{supp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
