// "use client";

// import { baseApi } from "../../../baseApi";

// export interface TargetGoal {
//   id: number;
//   user_id: number;
//   target_weight: number;
//   weekly_workout_goal: number;
//   daily_step_goal: number;
//   sleep_target: number;
//   is_active: boolean;
//   start_date: string;
//   end_date: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface GetTargetGoalResponse {
//   success: boolean;
//   message: string;
//   data: TargetGoal;
// }

// export interface TargetGoalRequest {
//   user_id: number;
//   target_weight: number;
//   weekly_workout_goal: number;
//   daily_step_goal: number;
//   sleep_target: number;
//   start_date: string;
//   end_date: string;
// }

// export interface TargetGoalResponse {
//   success: boolean;
//   message: string;
//   data: TargetGoal;
// }

// export const targetGoalApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getTargetGoal: builder.query<GetTargetGoalResponse, void>({
//       query: () => ({
//         url: "/goals",
//         method: "GET",
//       }),
//       providesTags: ["TargetGoals"],
//     }),

//     createTargetGoal: builder.mutation<TargetGoalResponse, TargetGoalRequest>({
//       query: (body) => ({
//         url: "/goals",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["TargetGoals"],
//     }),
//   }),
// });

// export const { useGetTargetGoalQuery, useCreateTargetGoalMutation } =
//   targetGoalApi;
"use client";

import { baseApi } from "../../../baseApi";

// ✅ Target Goal Type (match API exactly)
export interface TargetGoal {
  id: number;
  user_id: number;
  profession_id: number;

  target_weight: string; // API returns string
  weekly_workout_goal: number;
  daily_step_goal: number;
  sleep_target: string;

  water_target: number | string | null;
  supplement_recommendation: string[];

  is_active: boolean | number;

  start_date: string;
  end_date: string;

  created_at: string;
  updated_at: string;
}

// ✅ GET Response (array!)
export interface GetTargetGoalResponse {
  success: boolean;
  data: TargetGoal[];
}

// ✅ POST Body (create + update)
export interface TargetGoalRequest {
  id?: number; // optional → for update

  user_id: number;
  target_weight: number;
  weekly_workout_goal: number;
  daily_step_goal: number;
  sleep_target: number;

  water_target?: string | number | null;
  supplement_recommendation?: string[];

  start_date: string;
  end_date: string;
}

// ✅ POST Response
export interface TargetGoalResponse {
  success: boolean;
  message: string;
  data: TargetGoal;
}

export const targetGoalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET goals by user_id
    getTargetGoal: builder.query<TargetGoal[], number>({
      query: (userId) => ({
        url: `/get-goal/${userId}`,
        method: "GET",
      }),

      transformResponse: (response: GetTargetGoalResponse) => {
        return response.data;
      },

      providesTags: ["TargetGoals"],
    }),

    // ✅ CREATE / UPDATE goal
    createOrUpdateTargetGoal: builder.mutation<
      TargetGoalResponse,
      TargetGoalRequest
    >({
      query: (body) => ({
        url: "/goals",
        method: "POST",
        body,
      }),

      invalidatesTags: ["TargetGoals", "Users"], // refresh table + goals
    }),
  }),
});

// ✅ Hooks
export const { useGetTargetGoalQuery, useCreateOrUpdateTargetGoalMutation } =
  targetGoalApi;
