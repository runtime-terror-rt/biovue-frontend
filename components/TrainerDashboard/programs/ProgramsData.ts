export type PrimaryGoal =
  | "FAT LOSS"
  | "WELLNESS"
  | "MUSCLE GAIN"
  | "PERFORMANCE";

export type Intensity = "Aggressive" | "Light" | "Moderate";

export type Status = "ACTIVE" | "INACTIVE";

export interface Program {
  id: string;
  name: string;
  duration: string;
  primaryGoal: PrimaryGoal;
  intensity: Intensity;
  clients: number;
  status: Status;
  updatedAgo: string;
  focusAreas?: string[];
  habitFocus?: string[];
  wellnessMetrics?: Record<string, any>;
  supplementRecommendations?: Record<string, boolean>;
}

export const programs: Program[] = [
  {
    id: "2147225841",
    name: "12-WEEK FAT LOSS ACCELERATOR",
    duration: "12-WEEK",
    primaryGoal: "FAT LOSS",
    intensity: "Aggressive",
    clients: 6,
    status: "ACTIVE",
    updatedAgo: "3 DAYS AGO",
    focusAreas: ["Cardio", "Strength"],
    habitFocus: ["Nutrition", "Sleep"],
    wellnessMetrics: { calories: 1800, protein: 120, water: "2L" },
    supplementRecommendations: {
      wheyProtein: true,
      creatine: false,
      omega3: true,
      multivitamin: true,
      vitaminD3: false,
      magnesium: false,
    },
  },
  {
    id: "2147225842",
    name: "6-WEEK WELLNESS BOOST",
    duration: "6-WEEK",
    primaryGoal: "WELLNESS",
    intensity: "Light",
    clients: 4,
    status: "INACTIVE",
    updatedAgo: "5 DAYS AGO",
    focusAreas: ["Flexibility", "Mindfulness"],
    habitFocus: ["Hydration", "Meditation"],
    wellnessMetrics: { calories: 2000, protein: 90, water: "2.5L" },
    supplementRecommendations: {
      wheyProtein: false,
      creatine: false,
      omega3: true,
      multivitamin: true,
      vitaminD3: true,
      magnesium: false,
    },
  },
  {
    id: "2147225843",
    name: "8-WEEK MUSCLE GAIN PROGRAM",
    duration: "8-WEEK",
    primaryGoal: "MUSCLE GAIN",
    intensity: "Aggressive",
    clients: 10,
    status: "ACTIVE",
    updatedAgo: "2 DAYS AGO",
    focusAreas: ["Strength", "Hypertrophy"],
    habitFocus: ["Protein Intake", "Sleep"],
    wellnessMetrics: { calories: 2800, protein: 180, carbs: 350 },
    supplementRecommendations: {
      wheyProtein: true,
      creatine: true,
      omega3: false,
      multivitamin: true,
      vitaminD3: true,
      magnesium: false,
    },
  },
  {
    id: "2147225844",
    name: "PERFORMANCE TRAINING",
    duration: "10-WEEK",
    primaryGoal: "PERFORMANCE",
    intensity: "Light",
    clients: 5,
    status: "ACTIVE",
    updatedAgo: "1 DAY AGO",
    focusAreas: ["Speed", "Agility", "Endurance"],
    habitFocus: ["Recovery", "Mobility"],
    wellnessMetrics: { calories: 2500, protein: 140, cardio: "5h/week" },
    supplementRecommendations: {
      wheyProtein: true,
      creatine: false,
      omega3: true,
      multivitamin: true,
      vitaminD3: true,
      magnesium: true,
    },
  },
  {
    id: "2147225845",
    name: "WELLNESS & RECOVERY",
    duration: "4-WEEK",
    primaryGoal: "WELLNESS",
    intensity: "Aggressive",
    clients: 3,
    status: "INACTIVE",
    updatedAgo: "7 DAYS AGO",
    focusAreas: ["Yoga", "Stretching"],
    habitFocus: ["Sleep", "Hydration"],
    wellnessMetrics: { calories: 1800, protein: 100, mindfulness: "Daily" },
    supplementRecommendations: {
      wheyProtein: false,
      creatine: false,
      omega3: true,
      multivitamin: true,
      vitaminD3: true,
      magnesium: true,
    },
  },
];
