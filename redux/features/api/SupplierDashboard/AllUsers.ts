"use client";

import { baseApi } from "../baseApi";

export interface TargetGoal {
  id: number;
  target_weight: string;
  weekly_workout_goal: number;
  daily_step_goal: number;
  sleep_target: string;
  water_target: number | null;
  supplement_recommendation: string | string[] | null;
  start_date: string;
  end_date: string;
}

export interface UserProfileData {
  id?: number;
  age?: number | null;
  sex?: string | null;
  height?: string | number | null;
  weight?: string | number | null;
  unit?: string | null;
  is_athletic?: boolean | number;
  toned?: boolean | number;
  lean?: boolean | number;
  muscular?: boolean | number;
  curvy_fit?: boolean | number;
  body_goal?: string | null;
  notes?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  user_type: "Individual" | "Professional";
  profession_type?: string | null;
  profile_image: string | null;
  joined_at: string;
  profile?: UserProfileData | null;
  /** Present when the supplier users list embeds goals; used when /get-goal is empty or unavailable. */
  target_goals?: TargetGoal[] | TargetGoal | null;
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
