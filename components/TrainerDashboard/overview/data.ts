export interface ActionCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

export interface Client {
  id: number;
  name: string;
  goal: string;
  projectionUsed: string;
  status: "on-track" | "need-attention" | "inactive";
  activity: string;
}

export interface AIObservedMetric {
  id: string;

  label: string; // WEIGHT, SLEEP AVERAGE, etc
  value: string; // -8 lbs, 6.4 Hrs, Moderate

  tag: {
    text: string; // AI OBSERVED
    color: "purple"; // future-proof
  };

  updatedTime: string; // Updated 2h ago
}
export interface VisibilityControl {
  id: string;
  label: string;
  enabled: boolean;
}
export interface ClientDetails extends Client {
  connectedDate: string;
  programContext: {
    name: string;
    duration: string;
    primaryGoal: string;
    templateIntensity: string;
  };
  visibilityControls: VisibilityControl[];
  aiObservedMetrics: AIObservedMetric[];
  primaryGoal: {
    title: string;
    subtitle: string;
  };
  currentTrend: {
    status: string;
    description: string;
  };
  lastActivity: {
    status: string;
    description: string;
  };
  consistencyScore: {
    score: number;
    description: string;
  };
  projectionUsage: {
    used: number;
    total: number;
    nextResetDays: number;
    lastProjectionDaysAgo: number;
  };
  healthHabitOverview: {
    weight: {
      value: number;
      unit: string;
      targetApplied: boolean;
    };
    nutritionQuality: {
      value: number;
      targetApplied: boolean;
    };
    activity: {
      steps: number;
    };
    sleep: {
      hours: number;
      minutes: number;
      targetApplied: boolean;
    };
    stress: "Low" | "Medium" | "High";
    hydration: {
      value: number;
      unit: string;
    };
  };
  coachSetGoals: {
    targetWeight: number;
    weeklyWorkoutGoal: number;
    dailyStepGoal: number;
    sleepTargetHours: number;
  };
  nextCheckIn: {
    day: string;
    date: string;
    time: string;
    timezone: string;
  };
  compliance: {
    score: number;
    description: string;
  };
  // Keeping old fields for compatibility if needed, but focusing on new ones
  currentWeight: number;
  targetWeight: number;
  bmi: number;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
  };
  workouts: {
    weekly: number;
    goal: number;
  };
  waterIntake: {
    current: number;
    goal: number;
    unit: string;
  };
  healthMetrics: {
    startWeight: number;
    currentWeight: number;
    weeklyWeightLoss: number;
  };
  coachNotes: string[];
  progressGoals: {
    goal: string;
    progress: number;
    target: number;
    unit: string;
  }[];
}

export const clients: Client[] = [
  {
    id: 1,
    name: "Alex Rivera",
    goal: "Fat loss",
    projectionUsed: "3/10",
    status: "need-attention",
    activity: "No log in 3days",
  },
  {
    id: 2,
    name: "Sarah Chen",
    goal: "Muscle gain",
    projectionUsed: "4/20",
    status: "need-attention",
    activity: "Logged in 2 hrs ago",
  },
  {
    id: 3,
    name: "Jordan Smith",
    goal: "General wellness",
    projectionUsed: "4/20",
    status: "need-attention",
    activity: "Missed check-in",
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    goal: "Mobility",
    projectionUsed: "3/10",
    status: "on-track",
    activity: "No log in 3days",
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    goal: "Stress reduction",
    projectionUsed: "3/10",
    status: "on-track",
    activity: "Logged today",
  },
  {
    id: 6,
    name: "Elena Rodriguez",
    goal: "Performance",
    projectionUsed: "3/10",
    status: "inactive",
    activity: "No log in 3days",
  },
  {
    id: 7,
    name: "Elena Rodriguez",
    goal: "Mobility",
    projectionUsed: "3/10",
    status: "need-attention",
    activity: "No log in 3days",
  },
  {
    id: 8,
    name: "Elena Rodriguez",
    goal: "Fat loss",
    projectionUsed: "3/10",
    status: "on-track",
    activity: "Logged in 2 hrs ago",
  },
  {
    id: 9,
    name: "Elena Rodriguez",
    goal: "Mobility",
    projectionUsed: "3/10",
    status: "inactive",
    activity: "No activity 14 days",
  },
];

export interface Activity {
  id: number;
  description: string;
  timeAgo: string;
}

export const activities: Activity[] = [
  {
    id: 1,
    description: "Alex logged sleep data",
    timeAgo: "10 mins",
  },
  {
    id: 2,
    description: "Maria completed weekly goal",
    timeAgo: "20 mins",
  },
  {
    id: 3,
    description: "You updated goals for John",
    timeAgo: "1 day",
  },
  {
    id: 4,
    description: "Sarah posted a progress photo",
    timeAgo: "4 hours",
  },
];

export interface StatCard {
  icon: React.ReactNode;
  number: string | number;
  label: string;
  description: string;
}
