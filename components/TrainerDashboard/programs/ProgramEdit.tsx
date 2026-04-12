"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useUpdateProgramMutation } from "@/redux/features/api/TrainerDashboard/Program/UpdateProgram";
import { toast } from "sonner";
import {
  useGetProgramsQuery,
  Program as APIProgram,
} from "@/redux/features/api/TrainerDashboard/Program/GetPrograms";

interface Program {
  id: string;
  name: string;
  duration: string;
  primaryGoal: string;
  intensity: string;
  focusCount: number;
  habitFocus: string[];
  programFocus: string[];
  weeklyActivityTarget: string;
  wellnessMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  supplements: string[];
  internalNotes: string;
}

interface ProgramEditProps {
  program: Program;
}

// Removed static PROGRAM_NAMES

const DURATIONS = [
  "4 weeks",
  "6 weeks",
  "8 weeks",
  "12 weeks",
  "16 weeks",
  "24 weeks",
];

const PRIMARY_GOALS = ["Fat Loss", "Muscle Gain", "Strength", "Endurance"];

const INTENSITIES = ["Light", "Moderate", "High"];

const WEEKLY_ACTIVITY_TARGETS = [
  "2-3 sessions/week",
  "3-4 sessions/week",
  "4-5 sessions/week",
  "5-6 sessions/week",
];

const HABIT_FOCUS_OPTIONS = [
  "Sleep",
  "Nutrition",
  "Activity",
  "Stress",
  "Hydration",
];

const PROGRAM_FOCUS_OPTIONS = [
  "Cardiovascular Health",
  "Strength Training",
  "Flexibility",
  "Mental Wellness",
];

const SUPPLEMENT_OPTIONS = [
  "Protein Powder",
  "Creatine Monohydrate",
  "Omega-3 Fish Oil",
  "Multivitamin",
  "Vitamin D3",
  "Magnesium",
];

export default function ProgramEdit({ program }: ProgramEditProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Program>(program);
  const [updateProgram, { isLoading: updating }] = useUpdateProgramMutation();
  const { data: programsData, isLoading: fetchingNames } =
    useGetProgramsQuery();

  const programNames = useMemo(() => {
    if (!programsData?.data) return [];
    return Array.from(
      new Set(programsData.data.map((p: APIProgram) => p.name)),
    );
  }, [programsData]);

  useEffect(() => {
    setFormData(program);
  }, [program]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMacroChange = (macro: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({
      ...prev,
      wellnessMacros: {
        ...prev.wellnessMacros,
        [macro]: numValue,
      },
    }));
  };

  const handleHabitFocusToggle = (habit: string) => {
    setFormData((prev) => ({
      ...prev,
      habitFocus: prev.habitFocus.includes(habit)
        ? prev.habitFocus.filter((h) => h !== habit)
        : [...prev.habitFocus, habit],
    }));
  };

  const handleProgramFocusToggle = (focus: string) => {
    setFormData((prev) => ({
      ...prev,
      programFocus: prev.programFocus.includes(focus)
        ? prev.programFocus.filter((f) => f !== focus)
        : [...prev.programFocus, focus],
    }));
  };

  const handleSupplementToggle = (supplement: string) => {
    setFormData((prev) => ({
      ...prev,
      supplements: prev.supplements.includes(supplement)
        ? prev.supplements.filter((s) => s !== supplement)
        : [...prev.supplements, supplement],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProgram({
        id: Number(formData.id),

        name: formData.name,
        duration: parseInt(formData.duration.split(" ")[0]) || 0,

        primary_goal: formData.primaryGoal,
        target_intensity: formData.intensity,

        habit_focus_areas: formData.habitFocus,
        program_focus: formData.programFocus,

        focus_areas: formData.programFocus,

        habit_focus: formData.habitFocus,

        calories: formData.wellnessMacros.calories,
        protein: formData.wellnessMacros.protein,
        carbs: formData.wellnessMacros.carbs,
        fat: formData.wellnessMacros.fat,

        supplement_recommendation: formData.supplements,
        supplement: formData.supplements,

        notes: formData.internalNotes,

        weekly_targets: [formData.weeklyActivityTarget],
      }).unwrap();

      toast.success("Program updated successfully");

      router.push(`/trainer-dashboard/programs/${formData.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update program");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Back Button */}
        <button
          onClick={handleCancel}
          className="mb-6 border-2 cursor-pointer rounded-lg border-[#3A86FF25] px-3 py-2 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Programs
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Program Basics */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg md:text-xl font-medium text-[#0FA4A9] mb-4 md:mb-6">
              Program Basics
            </h2>
            <div className="space-y-4">
              {/* Program Name */}
              <div className="w-full">
                <Label
                  htmlFor="name"
                  className="text-gray-700 text-md md:text-lg font-medium"
                >
                  Program Name
                </Label>
                <select
                  value={formData.name}
                  onChange={(e) => handleSelectChange("name", e.target.value)}
                  className="mt-2 w-full h-11 rounded-xl border border-gray-200 text-gray-500 text-sm px-3"
                >
                  <option value="">
                    {fetchingNames ? "Loading..." : "Select program name"}
                  </option>
                  {programNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration + Primary Goal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 text-md md:text-lg font-medium">
                    Duration
                  </Label>
                  <select
                    value={formData.duration}
                    onChange={(e) =>
                      handleSelectChange("duration", e.target.value)
                    }
                    className="mt-2 w-full h-11 rounded-xl border border-gray-200 text-gray-500 text-sm px-3"
                  >
                    <option value="">Select duration</option>
                    {DURATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-gray-700 text-md md:text-lg font-medium">
                    Primary Goal
                  </Label>
                  <select
                    value={formData.primaryGoal}
                    onChange={(e) =>
                      handleSelectChange("primaryGoal", e.target.value)
                    }
                    className="mt-2 w-full h-11 rounded-xl border border-gray-200 text-gray-500 text-sm px-3"
                  >
                    <option value="">Select goal</option>
                    {PRIMARY_GOALS.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Intensity */}
              <div>
                <Label className="text-gray-600 text-md md:text-lg font-medium">
                  Target Intensity
                </Label>
                <div className="mt-3 flex items-center gap-0 bg-[#0FA4A926] rounded-xl py-2 md:py-4 px-4 md:px-8">
                  {INTENSITIES.map((intensity) => (
                    <button
                      key={intensity}
                      type="button"
                      onClick={() => handleSelectChange("intensity", intensity)}
                      className={`flex-1 py-2 rounded-lg text-base font-medium transition-all duration-150 ${
                        formData.intensity === intensity
                          ? "bg-white text-gray-800 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {intensity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Program Structure */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg md:text-xl font-medium text-[#0FA4A9] mb-4 md:mb-6">
              Program Structure
            </h2>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="weeklyActivityTarget"
                  className="text-gray-700 text-md md:text-lg font-medium"
                >
                  Weekly Activity Target
                </Label>
                <select
                  value={formData.weeklyActivityTarget}
                  onChange={(e) =>
                    handleSelectChange("weeklyActivityTarget", e.target.value)
                  }
                  className="mt-2 w-full h-11 rounded-xl border border-gray-200 text-gray-500 text-sm px-3"
                >
                  <option value="">Select target</option>
                  {WEEKLY_ACTIVITY_TARGETS.map((target) => (
                    <option key={target} value={target}>
                      {target}
                    </option>
                  ))}
                </select>
              </div>

              {/* Habit Focus */}
              <div>
                <Label className="text-gray-700 text-md md:text-lg font-medium">
                  Habit Focus Areas
                </Label>
                <div className="flex items-center gap-3 mt-3">
                  {HABIT_FOCUS_OPTIONS.map((habit) => (
                    <button
                      key={habit}
                      type="button"
                      onClick={() => handleHabitFocusToggle(habit)}
                      className={`py-2 px-6 rounded-full text-sm font-medium text-center transition-colors ${
                        formData.habitFocus.includes(habit)
                          ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-300"
                          : "bg-transparent text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {habit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Program Focus */}
              <div>
                <Label className="text-gray-700 text-md md:text-lg font-medium">
                  Program Focus
                </Label>
                <div className="space-y-2 mt-3">
                  {PROGRAM_FOCUS_OPTIONS.map((focus) => (
                    <label
                      key={focus}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.programFocus.includes(focus)}
                        onChange={() => handleProgramFocusToggle(focus)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm md:text-base font-medium text-gray-700">
                        {focus}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Wellness Targets */}
          <div className="bg-white space-y-4 rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg md:text-xl font-medium text-[#0FA4A9] mb-4 md:mb-6">
              Wellness Targets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="calories"
                  className="text-[#5F6F73] text-md md:text-lg font-medium"
                >
                  Calories (kcal)
                </Label>
                <Input
                  type="number"
                  id="calories"
                  placeholder="e.g. 2000-2200"
                  value={formData.wellnessMacros.calories}
                  onChange={(e) =>
                    handleMacroChange("calories", e.target.value)
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="protein"
                  className="text-[#5F6F73] text-md md:text-lg font-medium"
                >
                  Protein (g)
                </Label>
                <Input
                  type="number"
                  id="protein"
                  placeholder="e.g. 160"
                  value={formData.wellnessMacros.protein}
                  onChange={(e) => handleMacroChange("protein", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="carbs"
                  className="text-[#5F6F73] text-md md:text-lg font-medium"
                >
                  Carbs (g)
                </Label>
                <Input
                  type="number"
                  id="carbs"
                  placeholder="e.g. 200"
                  value={formData.wellnessMacros.carbs}
                  onChange={(e) => handleMacroChange("carbs", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="fat"
                  className="text-[#5F6F73] text-md md:text-lg font-medium"
                >
                  Fat (g)
                </Label>
                <Input
                  type="number"
                  id="fat"
                  placeholder="e.g. 70"
                  value={formData.wellnessMacros.fat}
                  onChange={(e) => handleMacroChange("fat", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <p className="text-sm text-[#0FA4A9] flex gap-1 items-center bg-[#0FA4A91A] py-3 md:px-6 px-4 rounded-lg">
              <AlertCircle size={14} />
              <span>
                These are Wellness Targets, Not Medical Prescriptions. Clients
                Cannot Edit These Values.
              </span>
            </p>
          </div>

          {/* Supplement Recommendations */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg md:text-xl font-medium text-[#0FA4A9] mb-4 md:mb-6">
              Supplement Recommendations (Optional)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUPPLEMENT_OPTIONS.map((supplement) => (
                <label
                  key={supplement}
                  className="flex items-center gap-3 px-4 md:px-6 py-3 rounded-lg border-2 border-[#5F6F73] cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.supplements.includes(supplement)}
                    onChange={() => handleSupplementToggle(supplement)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {supplement}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Internal Program Notes */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg md:text-xl font-medium text-[#0FA4A9] mb-4 md:mb-6">
              Internal Program Notes (Private)
            </h2>

            <Textarea
              name="internalNotes"
              value={formData.internalNotes}
              onChange={handleInputChange}
              placeholder="Focus on adherence during weeks 4-6. Client needs more motivation on weekend tracking."
              className="min-h-32 placeholder:text-[#9AAEB2]"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="hover:opacity-80 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updating}
              className="bg-[#0FA4A9] px-6 py-4 hover:opacity-80 cursor-pointer"
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
