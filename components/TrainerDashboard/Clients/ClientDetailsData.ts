// export type ClientDetails = {
//   id: string;
//   name: string;
//   connectedDate: string;
//   goal: string;
//   currentWeight: number;
//   targetWeight: number;
//   bmi: number;
//   measurements: {
//     chest: number;
//     waist: number;
//     hips: number;
//   };
//   workouts: {
//     weekly: number;
//     goal: number;
//   };
//   waterIntake: {
//     current: number;
//     goal: number;
//     unit: string;
//   };
//   healthMetrics: {
//     startWeight: number;
//     currentWeight: number;
//     weeklyWeightLoss: number;
//   };
//   coachNotes: string[];
//   progressGoals: {
//     goal: string;
//     progress: number;
//     target: number;
//     unit: string;
//   }[];
// };

// export const clientDetailsData: Record<string, ClientDetails> = {
//   "1": {
//     id: "1",
//     name: "Joe Evans",
//     connectedDate: "Connected since",
//     goal: "Fat Loss",
//     currentWeight: 85.5,
//     targetWeight: 75,
//     bmi: 28.1,
//     measurements: {
//       chest: 105,
//       waist: 95,
//       hips: 105,
//     },
//     workouts: {
//       weekly: 3,
//       goal: 5,
//     },
//     waterIntake: {
//       current: 2.5,
//       goal: 3,
//       unit: "L",
//     },
//     healthMetrics: {
//       startWeight: 92,
//       currentWeight: 85.5,
//       weeklyWeightLoss: 0.8,
//     },
//     coachNotes: [
//       "Great progress this week! Keep up the consistency with workouts.",
//       "Need to focus more on hydration. Try to drink more water daily.",
//       "Starting to see results in the measurement data. Stay motivated!",
//     ],
//     progressGoals: [
//       { goal: "Weight Loss", progress: 6.5, target: 17, unit: "kg" },
//       { goal: "Waist Reduction", progress: 3, target: 8, unit: "cm" },
//       { goal: "Weekly Workouts", progress: 3, target: 5, unit: "times" },
//     ],
//   },
//   "2": {
//     id: "2",
//     name: "Sarah Johnson",
//     connectedDate: "Connected since",
//     goal: "Muscle Gain",
//     currentWeight: 62.5,
//     targetWeight: 67,
//     bmi: 23.2,
//     measurements: {
//       chest: 92,
//       waist: 70,
//       hips: 95,
//     },
//     workouts: {
//       weekly: 4,
//       goal: 4,
//     },
//     waterIntake: {
//       current: 2.8,
//       goal: 3,
//       unit: "L",
//     },
//     healthMetrics: {
//       startWeight: 60,
//       currentWeight: 62.5,
//       weeklyWeightLoss: 0.3,
//     },
//     coachNotes: [
//       "Excellent form on all exercises! Increase weight next session.",
//       "Protein intake is perfect. Maintain current diet plan.",
//       "Recovery is on track. Getting enough sleep is helping.",
//     ],
//     progressGoals: [
//       { goal: "Muscle Gain", progress: 2.5, target: 5, unit: "kg" },
//       { goal: "Strength Increase", progress: 15, target: 25, unit: "%" },
//       { goal: "Bench Press", progress: 75, target: 90, unit: "kg" },
//     ],
//   },
// };
import { ClientDetails, clients } from "../overview/data";

const baseDetails = {
  connectedDate: "Connected Oct 24, 2023",

  // properties added to satisfy the new ClientDetails interface
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

export const clientDetailsData: Record<string, ClientDetails> = {
  "1": {
    ...clients.find((c) => c.id === 1)!,
    ...baseDetails,
    name: "Alex Rivera",
    connectedDate: "Connected Oct 24, 2023",
  },
  "2": {
    ...clients.find((c) => c.id === 2)!,
    ...baseDetails,
    name: "Sarah Chen",
    goal: "Muscle gain",
    connectedDate: "Connected Nov 12, 2023",
  },
  "3": {
    ...clients.find((c) => c.id === 3)!,
    ...baseDetails,
    name: "Jordan Smith",
    goal: "General wellness",
    connectedDate: "Connected Jan 05, 2024",
  },
  "4": {
    ...clients.find((c) => c.id === 4)!,
    ...baseDetails,
    name: "Elena Rodriguez",
    connectedDate: "Connected Feb 20, 2024",
  },
  "5": {
    ...clients.find((c) => c.id === 5)!,
    ...baseDetails,
    name: "Elena Rodriguez",
    connectedDate: "Connected Mar 15, 2024",
  },
  "6": {
    ...clients.find((c) => c.id === 6)!,
    ...baseDetails,
    name: "Elena Rodriguez",
    connectedDate: "Connected Apr 02, 2024",
  },
  "7": {
    ...clients.find((c) => c.id === 7)!,
    ...baseDetails,
    name: "Elena Rodriguez",
    connectedDate: "Connected May 10, 2024",
  },
  "8": {
    ...clients.find((c) => c.id === 8)!,
    ...baseDetails,
    name: "Elena Rodriguez",
    connectedDate: "Connected Jun 22, 2024",
  },
  "9": {
    ...clients.find((c) => c.id === 9)!,
    ...baseDetails,
    name: "Elena Rodriguez",
    connectedDate: "Connected Jul 08, 2024",
  },
};
