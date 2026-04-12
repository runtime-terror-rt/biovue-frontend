import { baseApi } from "../../baseApi";

export interface IndividualProjection {
  projection_url: string;
  route: string;
  est_bmi: string;
  est_weight: string;
  expected_changes: string[];
  confidence_score: number;
}

export interface CombinedProjectionResponse {
  success: boolean;
  data: {
    projection_id: string;
    user_id: number;
    input_image: string;
    timeframe: string;
    resolution: string;
    projections_data: {
      current_lifestyle: IndividualProjection;
      future_goal: IndividualProjection;
    };
    summary_data: {
      total_latency_sec: number;
      total_cost_usd: number;
      total_token_cost_usd: number;
      total_image_cost_usd: number;
      total_tokens_input: number;
      total_tokens_output: number;
    };
    updated_at: string;
    created_at: string;
    id: number;
  };
}

export interface CombinedProjectionRequest {
  user_id: string | number;
  image: File;
  timeframe: string;
  resolution: string;
}

export const combinedProjectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    combinedProjection: builder.mutation<
      CombinedProjectionResponse,
      CombinedProjectionRequest
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("user_id", data.user_id.toString());
        formData.append("image", data.image, data.image.name);
        formData.append("timeframe", data.timeframe);
        formData.append("resolution", data.resolution);

        return {
          url: "/generate/projections",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Projection"],
    }),
  }),
  overrideExisting: true,
});

export const { useCombinedProjectionMutation } = combinedProjectionApi;
