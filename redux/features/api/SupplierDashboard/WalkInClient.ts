"use client";

import { baseApi } from "../baseApi";

export interface WalkInClientPayload {
  name: string;
  email: string;
  phone: string;
  unit: "imperial" | "metric";
  height: number;
  weight: number;
  age: number;
  sex: "male" | "female" | "other";
  body_goal: string;
  target_weight: number;
  daily_step_goal: number;
  is_athletic: boolean;
  toned: boolean;
  lean: boolean;
  muscular: boolean;
  curvy_fit: boolean;
  supplement_recommendation: string[];
}

export interface WalkInClientProfile {
  id: number;
  user_id: number;
  age: number;
  sex: string;
  height: string;
  weight: string;
  unit: string;
  body_fat: number | null;
  location: string | null;
  zipcode: string | null;
  agreed_terms: number;
  image: string | null;
  current_image: string | null;
  is_athletic: number;
  toned: number;
  lean: number;
  muscular: number;
  curvy_fit: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface WalkInClientTargetGoals {
  id: number;
  user_id: number;
  profession_id?: number | null;
  target_weight: string;
  weekly_workout_goal?: number | null;
  daily_step_goal: number;
  sleep_target?: string | null;
  water_target?: number | null;
  supplement_recommendation: string[];
  is_active?: number;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface WalkInClientData {
  id: number;
  name: string;
  email: string;
  user_type: string;
  terms_accepted: boolean;
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  profile: WalkInClientProfile;
  target_goals: WalkInClientTargetGoals;
}

export interface WalkInClientResponse {
  success: boolean;
  message: string;
  data: WalkInClientData;
}

export const walkInClientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWalkInClient: builder.mutation<
      WalkInClientResponse,
      WalkInClientPayload
    >({
      query: (body) => ({
        url: "/supplier/walk-in-client",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useCreateWalkInClientMutation } = walkInClientApi;
