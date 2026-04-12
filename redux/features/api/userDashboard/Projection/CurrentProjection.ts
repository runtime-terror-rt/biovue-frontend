import { projectionApi } from "./projectionApi";

export interface ProjectionResponse {
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

export interface ProjectionRequest {
  user_id: string;
  image: File;
  duration: string;
  resolution?: string;
  tier?: string;
}

export const projectionApiEndpoints = projectionApi.injectEndpoints({
  endpoints: (builder) => ({
    currentLifestyleProjection: builder.mutation<
      ProjectionResponse,
      ProjectionRequest
    >({
      query: (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === "image" && value instanceof File) {
              formData.append(key, value, value.name);
            } else {
              formData.append(key, value as string | Blob);
            }
          }
        });
        return {
          url: "/projection/current-lifestyle/",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useCurrentLifestyleProjectionMutation } = projectionApiEndpoints;
