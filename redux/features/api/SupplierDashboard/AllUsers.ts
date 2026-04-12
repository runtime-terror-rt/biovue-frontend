"use client";

import { baseApi } from "../baseApi";

export interface TargetGoal {
  id: number;
  target_weight: string;
  weekly_workout_goal: number;
  daily_step_goal: number;
  sleep_target: string;
  water_target: number | null;
  supplement_recommendation: string | null;
  start_date: string;
  end_date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  user_type: "Individual" | "Professional";
  profession_type?: string | null;
  profile_image: string | null;
  joined_at: string;
  target_goals: TargetGoal[];
}

export interface AllUsersResponse {
  success: boolean;
  data: User[];
}

export const allUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsersForSupplier: builder.query<User[], void>({
      query: () => ({
        url: "/all-users-for-supplyer",
        method: "GET",
      }),

      transformResponse: (response: AllUsersResponse): User[] => {
        return response.data;
      },

      providesTags: ["Users"],
    }),
  }),
});

export const { useGetAllUsersForSupplierQuery } = allUsersApi;
