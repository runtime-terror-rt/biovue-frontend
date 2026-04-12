"use client";

import { baseApi } from "../../../baseApi";

export interface GetAdjustProgramResponse {
  success: boolean;
  data: {
    id: number;
    user_id: number;
    target_weight: number;
    weekly_workouts: string;
    sleep_target_range: string;
    hydration_target: number;

    show_program_goals: number;
    show_personal_targets: number;
    show_progress_graphs: number;
    show_ai_insights: number;

    primary_focus_area: string;
    note: string;
    programs: string;

    created_at: string;
    updated_at: string;
  };
}

export const getAdjustProgramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdjustProgram: builder.query<GetAdjustProgramResponse, number>({
      query: (userId) => ({
        url: `/adjust-program/${userId}`,
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),
  }),
});

export const { useGetAdjustProgramQuery } = getAdjustProgramApi;
