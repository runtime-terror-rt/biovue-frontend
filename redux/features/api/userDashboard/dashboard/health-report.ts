import { baseApi } from "../../baseApi";

export interface Summary {
  wellness_score: number;
  days_active: string;
  data_logged_entries: number;
  unit_system: "metric" | "imperial";
}

export interface Weight {
  current: string;
  status: string;
  coach_target: string;
}

export interface BMI {
  current: number;
  status: string;
  ideal_range: string;
}

export interface Nutrition {
  last_meal_balance: string;
  protein_servings: number;
  note: string;
}

export interface DailySteps {
  current: string;
  coach_plan: string;
}

export interface SleepHours {
  current: string;
  coach_plan: string;
}

export interface Hydration {
  current_glasses: number;
  target: string;
}

export interface StressAndMood {
  latest_mood: string;
  avg_stress_level: number;
}

export interface HealthOverview {
  weight: Weight;
  bmi: BMI;
  nutrition: Nutrition;
  daily_steps: DailySteps;
  sleep_hours: SleepHours;
  hydration: Hydration;
  stress_and_mood: StressAndMood;
}

export interface Settings {
  show_graphs: boolean;
  show_ai: boolean;
}

export interface HealthReportData {
  summary: Summary;
  health_overview: HealthOverview;
  settings: Settings;
}

export interface HealthReportResponse {
  success: boolean;
  data: HealthReportData;
}

export const healthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealthReport: builder.query<HealthReportResponse, void>({
      query: () => ({
        url: "/health-report",
        method: "GET",
      }),
      providesTags: ["HealthHabitOverview"], // you can adjust tag
    }),
  }),
});

export const { useGetHealthReportQuery } = healthApi;
