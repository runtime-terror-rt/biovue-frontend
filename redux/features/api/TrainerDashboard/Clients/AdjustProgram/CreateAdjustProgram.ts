"use client";

import { baseApi } from "../../../baseApi";

export interface AdjustProgramRequest {
  id?: number;
  user_id: number;
  target_weight: number;
  weekly_workouts: string;
  sleep_target_range: string;
  hydration_target: number;
  show_program_goals: boolean;
  show_personal_targets: boolean;
  show_progress_graphs: boolean;
  show_ai_insights: boolean;
  primary_focus_area: string;
  note?: string;
  programs: string;
}

export interface AdjustProgramResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    target_weight: number;
    weekly_workouts: string;
    sleep_target_range: string;
    hydration_target: number;
    show_program_goals: boolean;
    show_personal_targets: boolean;
    show_progress_graphs: boolean;
    show_ai_insights: boolean;
    primary_focus_area: string;
    note: string;
    programs: string;
    created_at: string;
    updated_at: string;
  };
}

export const adjustProgramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adjustProgram: builder.mutation<
      AdjustProgramResponse,
      AdjustProgramRequest
    >({
      query: (body) => ({
        url: "/adjust-program",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Clients"],
    }),
  }),
});

export const { useAdjustProgramMutation } = adjustProgramApi;
