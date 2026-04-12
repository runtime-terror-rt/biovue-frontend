"use client";

import { baseApi } from "../../baseApi";

export interface UpdateProgramRequest {
  id: number;
  name: string;
  duration: number;
  primary_goal: string;
  target_intensity: string;

  habit_focus_areas: string[];
  program_focus: string[];
  focus_areas: string[];
  habit_focus: string[];

  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  supplement_recommendation: string[];
  supplement: string[];

  description?: string | null;
  notes?: string | null;

  weekly_targets: string[];
}

export interface UpdatedProgram {
  id: number;
  name: string;
  duration: number;
  primary_goal: string;
  target_intensity: string;

  description: string | null;
  notes: string | null;

  weekly_targets: string[];

  habit_focus_areas: string[];
  program_focus: string[];
  focus_areas: string[];
  habit_focus: string[];

  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  supplement_recommendation: string[];
  supplement: string[];

  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProgramResponse {
  status: boolean;
  message: string;
  data: UpdatedProgram;
}

export const updateProgramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProgram: builder.mutation<
      UpdateProgramResponse,
      UpdateProgramRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/program-sets/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Programs"],
    }),
  }),
});

export const { useUpdateProgramMutation } = updateProgramApi;
