"use client";

import { baseApi } from "../../baseApi";

export interface FutureGoalProjection {
  id: number;
  user_id: string;

  image: string | null;

  duration: string;
  resolution: string;
  tier: string;

  use_default_goal: boolean;

  goal: string;
  goal_description: string;

  projection_id: string | null;
  projection_url: string | null;

  route: string | null;
  timeframe: string | null;

  est_bmi: string | null;
  est_weight: string | null;

  expected_changes: string | null;

  confidence_score: string | null;

  created_at: string;
  updated_at: string;
}

export interface FutureGoalResponse {
  message: string;
  data: FutureGoalProjection;
}

export const futureGoalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFutureGoalProjection: builder.query<FutureGoalResponse, number | string>(
      {
        query: (userId) => ({
          url: `/projection-future-goal/latest/${userId}`,
          method: "GET",
        }),

        providesTags: ["Projection"],
      },
    ),
  }),
});

export const { useGetFutureGoalProjectionQuery } = futureGoalApi;
