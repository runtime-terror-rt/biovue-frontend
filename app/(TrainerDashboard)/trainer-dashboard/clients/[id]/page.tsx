"use client";

import { use } from "react";
import ClientDetailsContent from "@/components/TrainerDashboard/Clients/ClientDetailsContent";
import { notFound } from "next/navigation";
import { useGetTrainerOverviewQuery } from "@/redux/features/api/TrainerDashboard/trainerOverviewApi";
import { Loader2 } from "lucide-react";

const baseDetails = {
  connectedDate: "Connected Oct 24, 2023",
  programContext: {
    name: "Standard Training",
    duration: "12 weeks",
    primaryGoal: "Fat Loss",
    templateIntensity: "Moderate",
  },
  visibilityControls: [],
  aiObservedMetrics: [],
  primaryGoal: {
    title: "Fat Loss",
    subtitle: "Program duration 12 weeks",
  },
  currentTrend: {
    status: "Improving",
    description: "Based on last 14 days",
  },
  lastActivity: {
    status: "Logged 2h ago",
    description: "Yesterday: 10k steps",
  },
  consistencyScore: {
    score: 71,
    description: "Habits adherence",
  },
  projectionUsage: {
    used: 2,
    total: 2,
    nextResetDays: 18,
    lastProjectionDaysAgo: 12,
  },
  healthHabitOverview: {
    weight: {
      value: 193.1,
      unit: "lbs",
      targetApplied: true,
    },
    nutritionQuality: {
      value: 84,
      targetApplied: true,
    },
    activity: {
      steps: 8421,
    },
    sleep: {
      hours: 7,
      minutes: 12,
      targetApplied: true,
    },
    stress: "Low" as const,
    hydration: {
      value: 64,
      unit: "oz",
    },
  },
  coachSetGoals: {
    targetWeight: 190,
    weeklyWorkoutGoal: 4,
    dailyStepGoal: 800,
    sleepTargetHours: 8,
  },
  nextCheckIn: {
    day: "Tuesday",
    date: "Oct 31",
    time: "10:00 AM",
    timezone: "PDT",
  },
  compliance: {
    score: 88,
    description: "Alex is highly compliant with nutritional goals but misses 1/5 scheduled workouts.",
  },
  currentWeight: 193.1,
  targetWeight: 190,
  bmi: 28.1,
  measurements: {
    chest: 105,
    waist: 95,
    hips: 105,
  },
  workouts: {
    weekly: 3,
    goal: 5,
  },
  waterIntake: {
    current: 2.5,
    goal: 3,
    unit: "L",
  },
  healthMetrics: {
    startWeight: 200,
    currentWeight: 193.1,
    weeklyWeightLoss: 0.8,
  },
  coachNotes: ["Great progress this week!", "Focus more on hydration."],
  progressGoals: [
    { goal: "Weight Loss", progress: 6.5, target: 17, unit: "kg" },
  ],
};

export default function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const { data: overviewData, isLoading } = useGetTrainerOverviewQuery();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D9488]" />
      </div>
    );
  }

  const apiClient = overviewData?.client_table?.find((c) => c.user_id.toString() === id);

  if (!apiClient) {
    return notFound();
  }

  let mappedStatus: "on-track" | "need-attention" | "inactive" = "on-track";
  if (apiClient.status === "need-attention" || apiClient.status === "inactive") {
    mappedStatus = apiClient.status as "need-attention" | "inactive";
  }

  const clientDetails = {
    ...baseDetails,
    id: apiClient.user_id,
    name: apiClient.user_name,
    goal: apiClient.goal || "Not specified",
    projectionUsed: apiClient.projection_used || "-",
    status: mappedStatus,
    activity: apiClient.activity || "Recent",
  };

  return <ClientDetailsContent clientDetails={clientDetails as any} />;
}
