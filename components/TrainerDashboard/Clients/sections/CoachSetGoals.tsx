import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle2, Loader2, Save, Plus, Trash2, Utensils, Pill } from "lucide-react";
import { ClientDetails } from "../../overview/data";
import { useEffect, useState } from "react";
import {
  useCreateOrUpdateTargetGoalMutation,
  useGetTargetGoalQuery,
} from "@/redux/features/api/TrainerDashboard/Clients/TargetGoal/PostTargetGoal";
import { toast } from "sonner";

const supplementOptions = [
  { id: "protein", label: "Protein" },
  { id: "creatine", label: "Creatine" },
  { id: "multivitamin", label: "Multivitamin" },
  { id: "omega3", label: "Omega-3" },
  { id: "electrolytes", label: "Electrolytes" },
  { id: "vitaminD", label: "Vitamin D" },
  { id: "magnesium", label: "Magnesium" },
  { id: "other", label: "Other" },
  { id: "aminoAcids", label: "Amino Acids (BCAAs/Glutamine)" },
  { id: "preWorkout", label: "Pre-Workout" },
];

interface CoachSetGoalsProps {
  goals: ClientDetails["coachSetGoals"];
  clientDetails: ClientDetails;
}

export default function CoachSetGoals({
  goals,
  clientDetails,
}: CoachSetGoalsProps) {
  const [targetWeight, setTargetWeight] = useState<string>(
    goals?.targetWeight?.toString() ?? "",
  );
  const [weeklyWorkoutGoal, setWeeklyWorkoutGoal] = useState<string>(
    goals?.weeklyWorkoutGoal?.toString() ?? "",
  );
  const [dailyStepGoal, setDailyStepGoal] = useState<string>(
    goals?.dailyStepGoal?.toString() ?? "",
  );
  const [sleepTarget, setSleepTarget] = useState<string>(
    goals?.sleepTargetHours?.toString() ?? "",
  );
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);

  // Individual client macros
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");

  // Custom supplement suggestions & notes
  const [customSupplementInput, setCustomSupplementInput] = useState<string>("");
  const [supplementNotes, setSupplementNotes] = useState<string>("");

  const [createTargetGoal, { isLoading }] =
    useCreateOrUpdateTargetGoalMutation();
  const { data: goalData, isLoading: goalLoading } = useGetTargetGoalQuery(
    clientDetails.id,
  );
  const [goalId, setGoalId] = useState<number | null>(null);
  const [waterTarget, setWaterTarget] = useState<string>("");
  // useEffect(() => {
  //   if (goalData && goalData.length > 0) {
  //     const latestGoal = goalData[0]; // get-goal returns latest first
  //     setTargetWeight(latestGoal.target_weight?.toString() ?? "");
  //     setWeeklyWorkoutGoal(latestGoal.weekly_workout_goal?.toString() ?? "");
  //     setDailyStepGoal(latestGoal.daily_step_goal?.toString() ?? "");
  //     setSleepTarget(latestGoal.sleep_target?.toString() ?? "");
  //     setSelectedSupplements(latestGoal.supplement_recommendation ?? []);
  //   }
  // }, [goalData]);

  useEffect(() => {
    if (goalData && goalData.length > 0) {
      const latestGoal = goalData.find((g: any) => g.is_active) || goalData[0];

      setGoalId(latestGoal.id); 

      setTargetWeight(latestGoal.target_weight?.toString() ?? "");
      setWeeklyWorkoutGoal(latestGoal.weekly_workout_goal?.toString() ?? "");
      setDailyStepGoal(latestGoal.daily_step_goal?.toString() ?? "");
      setSleepTarget(latestGoal.sleep_target?.toString() ?? "");
      setSelectedSupplements(latestGoal.supplement_recommendation ?? []);
      setWaterTarget(latestGoal.water_target?.toString() ?? "");

      // Macros
      if (latestGoal.calories) setCalories(latestGoal.calories.toString());
      if (latestGoal.protein) setProtein(latestGoal.protein.toString());
      if (latestGoal.carbs) setCarbs(latestGoal.carbs.toString());
      if (latestGoal.fat) setFat(latestGoal.fat.toString());

      if (latestGoal.macros) {
        if (latestGoal.macros.calories) setCalories(latestGoal.macros.calories.toString());
        if (latestGoal.macros.protein) setProtein(latestGoal.macros.protein.toString());
        if (latestGoal.macros.carbs) setCarbs(latestGoal.macros.carbs.toString());
        if (latestGoal.macros.fat) setFat(latestGoal.macros.fat.toString());
      }

      if (latestGoal.supplement_notes) {
        setSupplementNotes(latestGoal.supplement_notes);
      }
    }
  }, [goalData]);

  const handleSupplementChange = (label: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedSupplements((prev) => [...prev, label]);
    } else {
      setSelectedSupplements((prev) => prev.filter((s) => s !== label));
    }
  };

  const handleAddCustomSupplement = () => {
    if (!customSupplementInput.trim()) return;
    const trimmed = customSupplementInput.trim();
    if (!selectedSupplements.includes(trimmed)) {
      setSelectedSupplements((prev) => [...prev, trimmed]);
      toast.success(`Added "${trimmed}" to client supplement suggestions`);
    } else {
      toast.info(`"${trimmed}" is already in the list`);
    }
    setCustomSupplementInput("");
  };

  // const handleSave = async () => {
  //   try {
  //     const now = new Date();
  //     const startDate = now.toISOString().split("T")[0];
  //     const endDate = new Date(now.setDate(now.getDate() + 30))
  //       .toISOString()
  //       .split("T")[0];

  //     const payload = {
  //       user_id: clientDetails.id,
  //       target_weight: parseFloat(targetWeight),
  //       weekly_workout_goal: parseInt(weeklyWorkoutGoal),
  //       daily_step_goal: parseInt(dailyStepGoal),
  //       sleep_target: parseFloat(sleepTarget),
  //       supplement_recommendation: selectedSupplements,
  //       start_date: startDate,
  //       end_date: endDate,
  //     };

  //     const response = await createTargetGoal(payload).unwrap();

  //     if (response.success) {
  //       toast.success(response.message || "Goal saved successfully");
  //     } else {
  //       toast.error(response.message || "Failed to save goal");
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "An error occurred while saving");
  //   }
  // };
  const handleSave = async () => {
    try {
      const now = new Date();
      const startDate = now.toISOString().split("T")[0];
      const endDate = new Date(now.setDate(now.getDate() + 30))
        .toISOString()
        .split("T")[0];

      const payload: any = {
        ...(goalId && { id: goalId }),

        user_id: clientDetails.id,
        target_weight: Number(targetWeight),
        weekly_workout_goal: Number(weeklyWorkoutGoal),
        daily_step_goal: Number(dailyStepGoal),
        sleep_target: Number(sleepTarget),

        water_target: waterTarget || null,
        supplement_recommendation: selectedSupplements,

        // Personalized client macros
        calories: calories ? Number(calories) : null,
        protein: protein ? Number(protein) : null,
        carbs: carbs ? Number(carbs) : null,
        fat: fat ? Number(fat) : null,

        supplement_notes: supplementNotes || null,

        start_date: startDate,
        end_date: endDate,
      };

      const res = await createTargetGoal(payload).unwrap();

      toast.success(res.message || "Client goals & macros saved successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save goal");
    }
  };
  if (goalLoading) {
    return (
      <div className="flex items-center justify-center h-50">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const isInvalid =
    !targetWeight || !weeklyWorkoutGoal || !dailyStepGoal || !sleepTarget;
  const clientUnit =
    (clientDetails as any)?.unit_system ||
    (clientDetails as any)?.unit ||
    (clientDetails as any)?.profile?.unit ||
    ((clientDetails as any)?.height && Number((clientDetails as any).height) > 110 ? "metric" : "imperial");
  const weightUnitLabel = clientUnit === "metric" ? "kg" : "lbs";

  return (
    <Card className="border-none ">
      <div className="">
        <CardContent className="p-6 bg-white rounded-lg md:col-span-2">
          <div className="flex justify-between items-start mb-4 md:mb-7">
            <div>
              <h2 className="text-xl mb-2 font-medium text-[#111827]">
                Coach-set Goals & Targets
              </h2>
              <p className="text-base text-[#666666]">
                Define benchmarks for the client&apos;s dashboard
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="">
              <label className="text-lg font-medium text-[#374151]">
                Target weight ({weightUnitLabel})
              </label>
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="w-full mt-5 px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all placeholder:text-[#9AAEB2]"
                placeholder={weightUnitLabel === "kg" ? "80" : "190"}
              />
            </div>

            <div className="">
              <label className="text-lg font-medium text-[#374151]">
                Weekly workout goal (sessions)
              </label>
              <input
                type="number"
                value={weeklyWorkoutGoal}
                onChange={(e) => setWeeklyWorkoutGoal(e.target.value)}
                className="w-full mt-5 px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all placeholder:text-[#9AAEB2]"
                placeholder="4"
              />
            </div>

            <div className="">
              <label className="text-lg font-medium text-[#374151]">
                Daily step goal
              </label>
              <input
                type="number"
                value={dailyStepGoal}
                onChange={(e) => setDailyStepGoal(e.target.value)}
                className="w-full mt-5 px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all placeholder:text-[#9AAEB2]"
                placeholder="800"
              />
            </div>
            <div>
              <label className="text-lg font-medium text-[#374151]">
                Water target (ounces)
              </label>
              <input
                type="number"
                value={waterTarget}
                onChange={(e) => setWaterTarget(e.target.value)}
                className="w-full mt-5 px-4 py-3 border border-[#E5E7EB] rounded-lg"
                placeholder="10"
              />
            </div>
            <div className="">
              <label className="text-lg font-medium text-[#374151]">
                Sleep target (hours)
              </label>
              <input
                type="number"
                value={sleepTarget}
                onChange={(e) => setSleepTarget(e.target.value)}
                className="w-full mt-5 px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all placeholder:text-[#9AAEB2]"
                placeholder="8"
              />
            </div>
          </div>

          {/* Client Nutrition & Macro Targets (Per Client) */}
          <div className="mt-8 pt-8 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 mb-2">
              <Utensils size={18} className="text-[#0D9488]" />
              <h3 className="text-lg font-medium text-[#111827]">
                Client Nutrition & Macro Targets
              </h3>
            </div>
            <p className="text-sm text-[#666666] mb-5">
              Set custom macronutrient and calorie targets specifically for this client (overrides generic program defaults)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#374151] block mb-2">
                  Daily Calories (kcal)
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="e.g. 2200"
                  className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0D9488] outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#374151] block mb-2">
                  Protein (grams)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="e.g. 165"
                  className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0D9488] outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#374151] block mb-2">
                  Carbohydrates (grams)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="e.g. 220"
                  className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0D9488] outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#374151] block mb-2">
                  Fats (grams)
                </label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="e.g. 70"
                  className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0D9488] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Supplement Recommendations */}
          <div className="mt-8 pt-8 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 mb-2">
              <Pill size={18} className="text-[#0D9488]" />
              <h4 className="font-medium text-lg text-gray-900">
                Supplement Recommendations & Suggestions
              </h4>
            </div>
            <p className="text-sm text-[#666666] mb-5">
              Select standard supplements or add personalized supplement suggestions for this client
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {supplementOptions.map((supplement) => (
                <label
                  key={supplement.id}
                  className="flex items-center gap-3 p-3.5 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all group"
                >
                  <input
                    type="checkbox"
                    checked={selectedSupplements.includes(supplement.label)}
                    onChange={(e) =>
                      handleSupplementChange(supplement.label, e.target.checked)
                    }
                    className="w-5 h-5 border border-gray-300 rounded-md text-[#0D9488] focus:ring-[#0D9488] transition-all cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[#111827] group-hover:text-[#0D9488] transition-colors">
                    {supplement.label}
                  </span>
                </label>
              ))}

              {/* Display any custom added supplements not in the standard list */}
              {selectedSupplements
                .filter((s) => !supplementOptions.some((opt) => opt.label === s))
                .map((customSup) => (
                  <div
                    key={customSup}
                    className="flex items-center justify-between p-3.5 border border-teal-200 bg-teal-50/50 rounded-xl"
                  >
                    <span className="text-sm font-semibold text-[#0D9488]">
                      ✓ {customSup}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSupplements((prev) =>
                          prev.filter((s) => s !== customSup),
                        )
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove suggestion"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
            </div>

            {/* Text box to add additional supplement suggestions */}
            <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 mb-5 space-y-3">
              <label className="text-sm font-bold text-gray-800 block">
                Add Additional Supplement Suggestion:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSupplementInput}
                  onChange={(e) => setCustomSupplementInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSupplement();
                    }
                  }}
                  placeholder="e.g. Ashwagandha 500mg, Zinc Picolinate, Glutamine..."
                  className="flex-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:ring-2 focus:ring-[#0D9488] outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSupplement}
                  className="px-4 py-2 bg-[#0D9488] text-white rounded-lg text-sm font-semibold hover:bg-[#0A7A6F] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Plus size={16} />
                  Add Suggestion
                </button>
              </div>
            </div>

            {/* Custom Notes / Instructions for Supplements */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 block">
                Specific Supplement Instructions & Guidance:
              </label>
              <textarea
                value={supplementNotes}
                onChange={(e) => setSupplementNotes(e.target.value)}
                placeholder="Write specific timing, dosage instructions, or recommendations for this client (e.g. Take 5g Creatine post-workout with simple carbs; take Magnesium 30 mins before sleep)..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:ring-2 focus:ring-[#0D9488] outline-none resize-none"
              />
            </div>
          </div>

          <div className="py-4">
            <button
              onClick={handleSave}
              disabled={isLoading || isInvalid}
              className="flex items-center gap-2 bg-[#0D9488] text-white p-4 cursor-pointer rounded-lg text-base font-medium hover:bg-[#0A7A6F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isLoading ? "Saving..." : "Save Goal"}
            </button>
          </div>
        </CardContent>
        {/* side component */}
        <div className="space-y-6 md:col-span-1">
          {/* <Card className="border-none  bg-[#0D9488] text-white overflow-hidden">
            <CardContent className="p-5 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-base font-medium tracking-wider uppercase opacity-80">
                  <Calendar size={24} />
                  NEXT CHECK-IN
                </div>
                <h3 className="text-2xl font-bold leading-tight">
                  {clientDetails.nextCheckIn.day},{" "}
                  {clientDetails.nextCheckIn.date}
                </h3>
                <p className="text-base font-medium opacity-80">
                  {clientDetails.nextCheckIn.time} (
                  {clientDetails.nextCheckIn.timezone})
                </p>
              </div>

              <button className="w-full bg-white text-[#0D9488] cursor-pointer p-4 rounded-lg text-sm font-bold hover:opacity-80 transition-all">
                Reschedule
              </button>
            </CardContent>
          </Card>

          <Card className="border border-[#0D9488]!  bg-[#9AAEB21A]">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-base font-medium text-[#0D9488] tracking-wider uppercase">
                <CheckCircle2 size={24} />
                COMPLIANCE
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-[#0D9488]">
                    {clientDetails.compliance.score}%
                  </span>
                  <span className="text-sm text-[#0D9488] font-medium">
                    avg
                  </span>
                </div>
                <p className="text-base text-[#0D9488] leading-relaxed font-medium">
                  {clientDetails.compliance.description}
                </p>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </Card>
  );
}
