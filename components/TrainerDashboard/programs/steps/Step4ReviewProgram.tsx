"use client";

import { useRouter } from "next/navigation";
import { ProgramFormData } from "../CreateProgramsModal";
import { useMemo, useState } from "react";

import { Check, Search, UserPlus, X } from "lucide-react";
import { useGetUsersQuery } from "@/redux/features/api/TrainerDashboard/Program/GetUsersList";
import { useAssignProgramUsersMutation } from "@/redux/features/api/TrainerDashboard/Program/AssignProgram";
import { toast } from "sonner";

interface Step4Props {
  formData: ProgramFormData;
  showSuccess: boolean;
  setShowSuccess: (v: boolean) => void;
  onClose: () => void;
}

export default function Step4ReviewProgram({
  formData,
  showSuccess,
  setShowSuccess,
  onClose,
}: Step4Props) {
  const router = useRouter();
  const { data, isLoading } = useGetUsersQuery();
  const users = data?.data || [];
  const [assignProgramUsers, { isLoading: assigning }] =
    useAssignProgramUsersMutation();
  const [showAssign, setShowAssign] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const habits = formData.habitFocus;
  const [showAssignSuccess, setShowAssignSuccess] = useState(false);
  const [showNoClientSelected, setShowNoClientSelected] = useState(false);
  const macros = [
    {
      title: "Calories",
      value: formData.wellnessMetrics.calories,
      unit: " kcal",
      bg: "bg-[#FEF3C7]",
      border: "border-[#26a69a]",
      titleColor: "text-[#92400E]",
      valueColor: "text-[#92400E]",
    },
    {
      title: "Protein",
      value: formData.wellnessMetrics.protein,
      unit: " g",
      bg: "bg-[#DBEAFE]",
      border: "border-[#1b5e20]",
      titleColor: "text-[#1E40AF]",
      valueColor: "text-[#1E40AF]",
    },
    {
      title: "Carbs",
      value: formData.wellnessMetrics.carbs,
      unit: " g",
      bg: "bg-[#FCE7F3]",
      border: "border-[#a5d6a7]",
      titleColor: "text-[#9F1239]",
      valueColor: "text-[#9F1239]",
    },
    {
      title: "Fat",
      value: formData.wellnessMetrics.fat,
      unit: " g",
      bg: "bg-[#D1FAE5]",
      border: "border-[#c5e1a5]",
      titleColor: "text-[#065F46]",
      valueColor: "text-[#065F46]",
    },
  ];
  const focusAreaLabelMap: Record<string, string> = {
    "weight-loss": "Weight Loss",
    performance: "Performance Improvement",
    "body-comp": "Body Composition",
    energy: "Energy & Recovery",
    health: "Overall Health Improvement",
  };

  const focusAreas = formData.focusAreas.map((id) => focusAreaLabelMap[id]);
  const supplements = Object.entries(formData.supplementRecommendations)
    .filter(([, value]) => value)
    .map(([key]) => key);
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const toggleUser = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const supplementLabelMap: Record<string, string> = {
    protein: "Protein",
    creatine: "Creatine",
    multivitamin: "Multivitamin",
    omega3: "Omega-3",
    electrolytes: "Electrolytes",
    vitaminD: "Vitamin D",
    magnesium: "Magnesium",
    aminoAcids: "Amino Acids",
    preWorkout: "Pre-Workout",
    other: "Other",
  };
  const handleSearch = () => {
    console.log("Searching for:", search);
  };
  return (
    <div className="min-h-screen ">
      <div className="py-5">
        <div className=" rounded-2xl">
          {/* Header */}
          <div className="border-b bg-white flex justify-between items-start">
            <div className="mb-2">
              <h2 className="text-3xl font-bold text-[#111827] leading-tight">
                Step 4 of 4 – Review Program
              </h2>
              <p className="text-base text-[#6B7280] mt-1">
                Confirm all details before creating the program
              </p>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full border-2 p-1 hover:opacity-80"
            >
              <X />
            </button>
          </div>

          <div className="space-y-3 md:space-y-5 pt-4 md:pt-8">
            {/* Program Basics */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <p className="text-sm uppercase font-bold tracking-wide text-[#6B7280]">
                Program Basics
              </p>

              <h3 className="text-xl md:text-3xl font-bold text-[#111827]">
                {formData.programName}
              </h3>

              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <p className="text-sm font-medium text-[#6B7280]">Duration</p>
                  <p className="text-base font-semibold text-[#111827]">
                    {formData.duration}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#6B7280]">
                    Primary Goal
                  </p>
                  <p className="text-base font-semibold text-[#111827]">
                    {formData.primaryGoal}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-[#111827]">
                    Target Intensity
                  </p>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#F59E0B15] text-[#F59E0B] text-base font-semibold">
                    {formData.targetIntensity.charAt(0).toUpperCase() +
                      formData.targetIntensity.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            {/* Habit Focus */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm uppercase font-semibold tracking-wide text-[#6B7280]">
                  Habit Focus
                </p>
                <span className="text-[12px] text-gray-400">
                  {habits.length} selected
                </span>
              </div>

              <div className="flex gap-2">
                {habits.map((habit) => (
                  <span
                    key={habit}
                    className="px-3.5 py-1.5 rounded-full  bg-[#EEF2FF] text-[#4F46E5] text-sm font-medium"
                  >
                    {habit}
                  </span>
                ))}
              </div>
            </div>
            {/* Program Focus */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
              <p className="text-sm uppercase font-semibold tracking-wide text-[#6B7280] mb-3">
                Program Focus
              </p>

              {focusAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-center gap-3 bg-[#F0FDF4] rounded-lg p-4"
                >
                  <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-base font-medium text-gray-800">
                    {area}
                  </span>
                </div>
              ))}
            </div>
            {/* Wellness Macros */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm uppercase font-semibold tracking-wide text-[#6B7280] mb-4">
                Wellness Macros
              </p>

              <div className="grid grid-cols-4 gap-3">
                {macros.map((macro) => (
                  <div
                    key={macro.title}
                    className={`rounded-lg p-4 ${macro.bg}`}
                  >
                    <p
                      className={`text-sm font-medium mb-1 ${macro.titleColor}`}
                    >
                      {macro.title}
                    </p>

                    <p
                      className={`text-[20px] font-bold leading-tight ${macro.valueColor}`}
                    >
                      {macro.value}
                      <span className="text-xl font-semibold">
                        {macro.unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Supplements */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm uppercase font-semibold tracking-wide text-[#6B7280] mb-4">
                Supplements
              </p>

              <div className="grid grid-cols-2 gap-3">
                {supplements.map((supp) => (
                  <div
                    key={supp}
                    className="flex items-center gap-2.5 border border-gray-200 rounded-lg px-4 py-2.5"
                  >
                    <div className="w-5 h-5 rounded-lg bg-[#6366F1] flex items-center justify-center shrink-0">
                      <Check size={14} className="text-white" />
                    </div>

                    <span className="text-base font-medium text-gray-800">
                      {/* {supp} */}
                      {supplementLabelMap[supp] ?? supp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SUCCESS MODAL */}
          {showSuccess && (
            <div
              onClick={() => setShowSuccess(false)}
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-100"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white max-w-xl rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-[#0FA4A926] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={36} className="text-[#0FA4A9]" />
                </div>

                <h3 className="text-2xl font-semibold">Program Created!</h3>

                <p className="text-[#8C9094] text-sm mt-2">
                  Power Recomp has been successfully saved to your dashboard.
                </p>

                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setShowAssign(true);
                  }}
                  className="mt-6 flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 w-full bg-[#0FA4A9] text-white py-3 rounded-lg"
                >
                  <UserPlus /> <span>Assign To Clients</span>
                </button>

                <button
                  onClick={() => {
                    setShowSuccess(false);
                    onClose();
                    router.push("/trainer-dashboard/programs");
                  }}
                  className="mt-3 w-full font-medium cursor-pointer hover:opacity-80 border py-3 rounded-lg text-[#0D9488]"
                >
                  Return To Programs
                </button>
              </div>
            </div>
          )}

          {/* ASSIGN CLIENT MODAL */}
          {showAssign && (
            <div
              onClick={() => setShowAssign(false)}
              className="fixed inset-0 bg-black/40 flex justify-center items-center z-100"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white mx-auto w-xl md:w-3xl  rounded-2xl p-4 md:p-8"
              >
                {/* header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl mb-3 md:text-2xl text-[#1F2D2E] font-medium">
                      Assign Program
                    </h3>

                    <p className="text-base text-[#5F6F73]">
                      Select clients to assign to Holistic Habit Transformation
                    </p>
                  </div>

                  <button onClick={() => setShowAssign(false)}>
                    <X className="cursor-pointer hover:opacity-80" />
                  </button>
                </div>
                {/* info */}
                <div className="bg-[#0FA4A91A] text-[#0FA4A9] text-sm px-3 md:px-7 py-2 md:py-5 rounded-lg mt-4">
                  Clients will see goals & targets but cannot edit structure.
                </div>
                {/* search */}
                <div className="relative w-full mt-4">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search clients by name or email..."
                    className="w-full placeholder:text-[#9AAEB2] border rounded-lg px-4 py-2 pl-10 "
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black  py-1 rounded-lg hover:bg-teal-700"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                {/* list */}
                <div className="mt-4 max-h-44 md:max-h-80 overflow-y-auto custom-scrollbar">
                  {isLoading && (
                    <div className="flex justify-center py-6">
                      <span className="text-gray-500 text-sm">
                        Loading clients...
                      </span>
                    </div>
                  )}

                  {!isLoading &&
                    filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex justify-between items-center py-3 border-b border-[#E3ECEB]"
                      >
                        {/* user info */}
                        <div className="px-3 md:px-6 py-2 md:py-4">
                          <p className="font-medium text-base mb-2">{u.name}</p>
                          <p className="text-sm text-[#5F6F73]">{u.email}</p>
                        </div>

                        {/* checkbox */}
                        <div className="pr-3 md:pr-6">
                          <input
                            type="checkbox"
                            checked={selected.includes(u.id)}
                            onChange={() => toggleUser(u.id)}
                            className="w-6 cursor-pointer h-6"
                          />
                        </div>
                      </div>
                    ))}
                </div>
                {/* footer */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      setShowAssign(false);
                      router.push("/trainer-dashboard/programs");
                    }}
                    className="border hover:opacity-80 cursor-pointer px-4 py-2 rounded-lg"
                  >
                    Skip For Now
                  </button>

                  <button
                    onClick={async () => {
                      if (selected.length === 0) {
                        setShowNoClientSelected(true);
                        return;
                      }

                      try {
                        await assignProgramUsers({
                          program_set_id: 2, // program id
                          user_ids: selected,
                        }).unwrap();

                        toast.success("Program assigned successfully");

                        setShowAssignSuccess(true);
                      } catch (error) {
                        console.error(error);
                        toast.error("Failed to assign program");
                      }
                    }}
                    className="bg-[#0D9488] cursor-pointer hover:opacity-80 text-white px-5 py-2 rounded-lg"
                  >
                    Assign Program
                  </button>
                </div>
              </div>
            </div>
          )}

          {showAssignSuccess && (
            <div
              onClick={() => setShowSuccess(false)}
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-200"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white max-w-md rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-[#0FA4A926] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={36} className="text-[#0FA4A9]" />
                </div>

                <h3 className="text-2xl font-semibold">Program Assigned!</h3>
                <p className="text-[#8C9094] text-sm mt-2">
                  The program has been successfully assigned to selected
                  clients.
                </p>

                <button
                  onClick={() => {
                    setShowAssignSuccess(false);
                    setShowAssign(false);
                    router.push("/trainer-dashboard/programs");
                  }}
                  className="mt-6 cursor-pointer w-full bg-[#0FA4A9] text-white py-3 rounded-lg hover:opacity-80"
                >
                  OK
                </button>
              </div>
            </div>
          )}
          {showNoClientSelected && (
            <div
              onClick={() => setShowSuccess(false)}
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-200"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white max-w-md rounded-2xl p-6 text-center"
              >
                <h3 className="text-2xl font-semibold text-red-600">
                  No Client Selected!
                </h3>
                <p className="text-[#8C9094] text-sm mt-2">
                  Please select at least one client to assign the program.
                </p>

                <button
                  onClick={() => setShowNoClientSelected(false)}
                  className="mt-6 cursor-pointer w-full bg-[#0FA4A9] text-white py-3 rounded-lg hover:opacity-80"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
