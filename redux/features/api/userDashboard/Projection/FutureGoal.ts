"use client";

import { projectionApi } from "./projectionApi";

interface FutureGoalResponse {
  user_id: string;
  projection_id: string;
  projection_url: string;
  route: string;
  timeframe: string;
  est_bmi: string;
  est_weight: string;
  expected_changes: string[];
  confidence_score: string;
}

interface FutureGoalRequest {
  user_id: string;
  image: File;
  duration: string;
  resolution?: string;
  tier?: string;
  use_default_goal?: boolean;
  goal?: string;
  goal_description?: string;
}

export const futureGoalApi = projectionApi.injectEndpoints({
  endpoints: (builder) => ({
    createFutureGoal: builder.mutation<FutureGoalResponse, FutureGoalRequest>({
      query: (data) => {
        const formData = new FormData();

        formData.append("user_id", data.user_id);
        formData.append("image", data.image, data.image.name);
        formData.append("duration", data.duration);

        if (data.resolution) formData.append("resolution", data.resolution);
        if (data.tier) formData.append("tier", data.tier);

        formData.append(
          "use_default_goal",
          String(data.use_default_goal ?? true),
        );

        if (data.goal) formData.append("goal", data.goal);
        if (data.goal_description)
          formData.append("goal_description", data.goal_description);

        return {
          url: "/projection/future-goal/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Projection"],
    }),
  }),
  overrideExisting: true,
});

export const { useCreateFutureGoalMutation } = futureGoalApi;
