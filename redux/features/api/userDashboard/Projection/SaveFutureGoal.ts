"use client";

import { baseApi } from "../../baseApi";

export interface SaveFutureGoalRequest {
  user_id: number | string;
  image?: File | null;
  projection_id?: string;
  projection_url?: string;
  route?: string;
  timeframe?: string;
  est_bmi?: string;
  est_weight?: string;
  expected_changes?: string[];
  confidence_score?: string;
  duration?: string;
  resolution?: string;
  tier?: string;
  use_default_goal?: boolean;
  goal?: string;
  goal_description?: string;
}

export interface FutureGoalSaved {
  id: number;
  user_id: string;
  image: string | null;
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

export interface SaveFutureGoalResponse {
  message: string;
  data: FutureGoalSaved;
}

export const saveFutureGoalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveFutureGoal: builder.mutation<
      SaveFutureGoalResponse,
      SaveFutureGoalRequest
    >({
      query: (body) => {
        const formData = new FormData();

        formData.append("user_id", String(body.user_id));

        if (body.image) {
          formData.append("image", body.image);
        }
        if (body.projection_id) {
          formData.append("projection_id", body.projection_id);
        }
        if (body.projection_url) {
          formData.append("projection_url", body.projection_url);
        }
        if (body.route) {
          formData.append("route", body.route);
        }
        if (body.timeframe) {
          formData.append("timeframe", body.timeframe);
        }
        if (body.est_bmi) {
          formData.append("est_bmi", body.est_bmi);
        }
        if (body.est_weight) {
          formData.append("est_weight", body.est_weight);
        }
        if (body.expected_changes) {
          formData.append(
            "expected_changes",
            JSON.stringify(body.expected_changes)
          );
        }
        if (body.confidence_score) {
          formData.append("confidence_score", body.confidence_score);
        }
        if (body.duration) {
          formData.append("duration", body.duration);
        }
        if (body.resolution) {
          formData.append("resolution", body.resolution);
        }
        if (body.tier) {
          formData.append("tier", body.tier);
        }
        if (body.use_default_goal !== undefined) {
          formData.append("use_default_goal", String(body.use_default_goal));
        }
        if (body.goal) {
          formData.append("goal", body.goal);
        }
        if (body.goal_description) {
          formData.append("goal_description", body.goal_description);
        }

        return {
          url: "/projection-future-goal",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Projection"],
    }),
  }),
});

export const { useSaveFutureGoalMutation } = saveFutureGoalApi;
