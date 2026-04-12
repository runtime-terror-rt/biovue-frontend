"use client";

import { useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  Eye,
  Focus,
  History,
  Notebook,
  Save,
  Settings,
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Card } from "../../../../../components/ui/card";
import { Switch } from "../../../../../components/ui/switch";

import { useGetAdjustProgramQuery } from "@/redux/features/api/TrainerDashboard/Clients/AdjustProgram/GetAdjustProgram";
import { useAdjustProgramMutation } from "@/redux/features/api/TrainerDashboard/Clients/AdjustProgram/CreateAdjustProgram";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CoachingDashboard() {
  const router = useRouter();

  const userId = 3;

  const { data, isLoading } = useGetAdjustProgramQuery(userId);
  const [adjustProgram, { isLoading: saving }] = useAdjustProgramMutation();

  const client = data?.data;

  const [targetWeight, setTargetWeight] = useState(0);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState("");
  const [sleepMin, setSleepMin] = useState(0);
  const [sleepMax, setSleepMax] = useState(0);
  const [hydration, setHydration] = useState(0);

  const [showProgramGoals, setShowProgramGoals] = useState(false);
  const [showPersonalTargets, setShowPersonalTargets] = useState(false);
  const [showProgressGraphs, setShowProgressGraphs] = useState(false);
  const [showAiInsights, setShowAiInsights] = useState(false);

  const [program, setProgram] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (client) {
      setTargetWeight(client.target_weight);
      setWeeklyWorkouts(client.weekly_workouts);
      setHydration(client.hydration_target);

      setShowProgramGoals(Boolean(client.show_program_goals));
      setShowPersonalTargets(Boolean(client.show_personal_targets));
      setShowProgressGraphs(Boolean(client.show_progress_graphs));
      setShowAiInsights(Boolean(client.show_ai_insights));

      setProgram(client.programs);
      setFocusArea(client.primary_focus_area);
      setNote(client.note);

      const sleep = client.sleep_target_range.split("-");
      setSleepMin(Number(sleep[0]));
      setSleepMax(Number(sleep[1]));
    }
  }, [client]);

  const handleSave = async () => {
    try {
      const res = await adjustProgram({
        user_id: userId,
        target_weight: targetWeight,
        weekly_workouts: weeklyWorkouts,
        sleep_target_range: `${sleepMin}-${sleepMax}`,
        hydration_target: hydration,
        show_program_goals: showProgramGoals,
        show_personal_targets: showPersonalTargets,
        show_progress_graphs: showProgressGraphs,
        show_ai_insights: showAiInsights,
        primary_focus_area: focusArea,
        note,
        programs: program,
      }).unwrap();

      toast.success(res.message || "Program updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update program");
    }
  };

  if (isLoading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen ">
      <div className="">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <button
            onClick={() => router.back()}
            className="flex cursor-pointer items-center gap-1 text-sm text-[#64748B] hover:text-[#475569]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl font-semibold text-[#111827]">
            User #{client?.user_id}
          </h1>
          {/* pore client details er API dile ei part bosabo. */}
          {/* <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#111827]">
              {clientDetails.name}
            </h1>
            <p
              className={`${statusConfig[clientDetails.status]} px-3 rounded-full  border-none capitalize`}
            >
              {clientDetails.status.replace("-", " ")}
            </p>
          </div>
          <p className="text-base font-medium text-[#6B7280]">
            {clientDetails.primaryGoal.subtitle}
          </p> */}
        </div>

        {/* Program Context */}
        {/* <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold tracking-wide text-[#0F172A]">
            Program Context
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { label: "Name", value: clientDetails.programContext.name },
              {
                label: "Duration",
                value: clientDetails.programContext.duration,
              },
              {
                label: "Primary Goal",
                value: clientDetails.programContext.primaryGoal,
              },
              {
                label: "Template Intensity",
                value: clientDetails.programContext.templateIntensity,
              },
            ].map(({ label, value }) => (
              <Card
                key={label}
                className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-none"
              >
                <p className="text-sm font-semibold uppercase text-[#5F6F73]">
                  {label}
                </p>
                <p className="mt-3 text-base font-semibold text-[#111827]">
                  {value}
                </p>
              </Card>
            ))}
          </div>
        </div> */}

        {/* AI-Observed Metrics */}
        {/* <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-[#0F172A]">
            AI-Observed Metrics
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {clientDetails.aiObservedMetrics.map((metric) => (
              <div key={metric.id} className="rounded-xl border bg-white p-5">
                <p className="text-base font-medium text-black uppercase">
                  {metric.label}
                </p>

                <p className="mt-2 text-xl font-medium text-gray-900">
                  {metric.value}
                </p>

                <p className="mt-2 text-sm text-[#8746E7] flex items-center gap-1">
                  ● {metric.tag.text}
                </p>

                <p className="mt-2 text-sm text-[#5F6F73]">
                  {metric.updatedTime}
                </p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Bottom Section */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Coach Set Targets */}
          <Card className="rounded-lg border border-[#E5E7EB] bg-white py-8 px-6 shadow-none">
            <div className="mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4 text-[#0F172A]" />
              <h3 className="text-lg font-medium text-[#0F172A]">
                Coach Set Targets
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-medium text-[#6B7280]">
                    Target Weight (lbs)
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(Number(e.target.value))}
                      className="flex-1 rounded border border-[#D1D5DB] bg-white px-3 py-2 text-base font-semibold text-[#5F6F73] placeholder-[#9CA3AF]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-[#6B7280]">
                    Weekly Workouts
                  </label>
                  <div className="mt-2">
                    <select
                      value={weeklyWorkouts}
                      onChange={(e) => setWeeklyWorkouts(e.target.value)}
                      className="w-full rounded border border-[#D1D5DB] bg-white px-3 py-2 text-base font-semibold text-[#5F6F73]"
                    >
                      <option>4 Sessions / Week</option>
                      <option>3 Sessions / Week</option>
                      <option>5 Sessions / Week</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-medium text-[#6B7280]">
                    Sleep Target Range (hrs)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="mt-2">
                      <input
                        type="number"
                        value={sleepMin}
                        onChange={(e) => setSleepMin(Number(e.target.value))}
                        className="w-full rounded border border-[#D1D5DB] bg-white px-3 py-2 text-base font-semibold text-[#5F6F73]"
                      />
                    </div>
                    <div className="mt-2">
                      <input
                        type="number"
                        value={sleepMax}
                        onChange={(e) => setSleepMax(Number(e.target.value))}
                        className="w-full rounded border border-[#D1D5DB] bg-white px-3 py-2 text-base font-semibold text-[#5F6F73]"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-[#6B7280]">
                    Hydration Target (L)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      value={hydration}
                      step="0.5"
                      onChange={(e) => setHydration(Number(e.target.value))}
                      className="w-full rounded border border-[#D1D5DB] bg-white px-3 py-2 text-base font-semibold text-[#5F6F73]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Client Visibility Controls */}
          <Card className="rounded-lg border border-[#E5E7EB] bg-white py-8 px-6  shadow-none">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
              <Eye className="h-4 w-4" />
              Client Visibility Controls
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <p>Show Program Goals</p>
                <Switch
                  checked={showProgramGoals}
                  onCheckedChange={setShowProgramGoals}
                />
              </div>

              <div className="flex justify-between">
                <p>Show Personal Targets</p>
                <Switch
                  checked={showPersonalTargets}
                  onCheckedChange={setShowPersonalTargets}
                />
              </div>

              <div className="flex justify-between">
                <p>Show Progress Graphs</p>
                <Switch
                  checked={showProgressGraphs}
                  onCheckedChange={setShowProgressGraphs}
                />
              </div>

              <div className="flex justify-between">
                <p>Show AI Insights</p>
                <Switch
                  checked={showAiInsights}
                  onCheckedChange={setShowAiInsights}
                />
              </div>
            </div>
          </Card>

          <Card className="rounded-lg border border-[#E5E7EB] bg-white py-8 px-6  shadow-none">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
              <Focus className="h-4 w-4" />
              Focus & Intensity Adjustment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-base font-medium text-[#6B7280]">
                  Program
                </label>
                <div className="mt-3">
                  <select
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className="w-full rounded border border-[#D1D5DB] bg-white px-3 py-2 text-base font-semibold text-[#5F6F73]"
                  >
                    <option>Fat Loss</option>
                    <option>Bulking</option>
                    <option>Weight Gain</option>
                  </select>
                </div>
              </div>

              <div className="">
                <label className="text-base font-medium text-[#6B7280]">
                  Primary Focus Area
                </label>
                <div className="mt-4 flex gap-2 bg-[#0FA4A91A] rounded-lg px-6 py-2">
                  <input
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
              <p className="text-sm text-[#E5A966] flex items-center gap-1 uppercase">
                <AlertCircle size={14} />
                <span>This overrides the template intensity</span>
              </p>
            </div>
          </Card>

          <Card className="rounded-lg border border-[#E5E7EB] bg-white py-8 px-6  shadow-none">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
              <Notebook className="h-4 w-4" />
              Internal Coach Notes (Private)
            </h3>

            <div className="space-y-4">
              <div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add private observations, risks, or follow-up reminders..."
                  className="px-3 py-2 border rounded-lg w-full h-40 resize-none focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>
              <p className="text-sm  flex items-center gap-1 text-[#8746E7]">
                <Eye />
                <span>
                  Clients cannot see this section. Only visible to BioVue
                </span>
                staff.
              </p>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-6">
          <Button
            variant="outline"
            className="border-[#D1D5DB] cursor-pointer text-sm text-[#111827] hover:bg-[#F9FAFB]"
          >
            <History /> Reset to Program Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0D9488] cursor-pointer hover:bg-[#0F766E]"
          >
            <Save /> {saving ? "Saving..." : "Save Adjustments"}
          </Button>
        </div>
      </div>
    </div>
  );
}
