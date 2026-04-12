import { ClientDetails } from "../../../../../components/TrainerDashboard/overview/data";

export const clientDetailsMock: ClientDetails = {
  id: 1,
  name: "Alex Rivera",
  goal: "Fat loss",
  projectionUsed: "3/10",
  status: "need-attention",
  activity: "No log in 3days",

  connectedDate: "Connected since Jan 12, 2024",
  programContext: {
    name: "Power Recomp",
    duration: "12 weeks",
    primaryGoal: "Fat Loss Hypertrophy",
    templateIntensity: "High",
  },

  visibilityControls: [
    {
      id: "show_program_goals",
      label: "Show Program Goals to Client",
      enabled: true,
    },
    {
      id: "show_personal_targets",
      label: "Show Personal Targets",
      enabled: true,
    },
    {
      id: "show_progress_graphs",
      label: "Show Progress Graphs",
      enabled: false,
    },
    {
      id: "show_ai_insights",
      label: "Show AI Insights",
      enabled: true,
    },
  ],

  aiObservedMetrics: [
    {
      id: "weight",
      label: "Weight",
      value: "-8 lbs",
      tag: {
        text: "AI Observed",
        color: "purple",
      },
      updatedTime: "Updated 2h ago",
    },
    {
      id: "sleep_average",
      label: "Sleep Average",
      value: "6.4 Hrs",
      tag: {
        text: "AI Observed",
        color: "purple",
      },
      updatedTime: "Updated 3h ago",
    },
    {
      id: "activity_level",
      label: "Activity Level",
      value: "Moderate",
      tag: {
        text: "AI Observed",
        color: "purple",
      },
      updatedTime: "Updated 1 day ago",
    },
    {
      id: "nutrition_adherence",
      label: "Nutrition Adherence",
      value: "84%",
      tag: {
        text: "AI Observed",
        color: "purple",
      },
      updatedTime: "Updated 1 day ago",
    },
    {
      id: "stress_level",
      label: "Stress Level",
      value: "Low",
      tag: {
        text: "AI Observed",
        color: "purple",
      },
      updatedTime: "Updated 1 day ago",
    },
    {
      id: "hydration",
      label: "Hydration",
      value: "1.8L/day",
      tag: {
        text: "AI Observed",
        color: "purple",
      },
      updatedTime: "Updated 1 day ago",
    },
  ],
  primaryGoal: {
    title: "Fat Loss",
    subtitle: "Lose 10 lbs in 12 weeks",
  },

  currentTrend: {
    status: "Downward",
    description: "Weight decreasing steadily",
  },

  lastActivity: {
    status: "Inactive",
    description: "No activity in last 3 days",
  },

  consistencyScore: {
    score: 76,
    description: "Good adherence overall",
  },

  projectionUsage: {
    used: 3,
    total: 10,
    nextResetDays: 12,
    lastProjectionDaysAgo: 2,
  },

  healthHabitOverview: {
    weight: { value: 82, unit: "kg", targetApplied: true },
    nutritionQuality: { value: 7, targetApplied: true },
    activity: { steps: 6500 },
    sleep: { hours: 7, minutes: 30, targetApplied: true },
    stress: "Medium",
    hydration: { value: 2.5, unit: "L" },
  },

  coachSetGoals: {
    targetWeight: 75,
    weeklyWorkoutGoal: 4,
    dailyStepGoal: 8000,
    sleepTargetHours: 8,
  },

  nextCheckIn: {
    day: "Monday",
    date: "Mar 4",
    time: "10:00 AM",
    timezone: "GMT+6",
  },

  compliance: {
    score: 82,
    description: "Client is mostly compliant",
  },

  currentWeight: 82,
  targetWeight: 75,
  bmi: 24.5,
  measurements: { chest: 98, waist: 84, hips: 100 },
  workouts: { weekly: 3, goal: 4 },
  waterIntake: { current: 2, goal: 3, unit: "L" },
  healthMetrics: {
    startWeight: 90,
    currentWeight: 82,
    weeklyWeightLoss: 0.6,
  },
  coachNotes: [],
  progressGoals: [],
};
