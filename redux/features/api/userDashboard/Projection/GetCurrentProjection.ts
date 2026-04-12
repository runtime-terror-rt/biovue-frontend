import { baseApi } from "../../baseApi";

export interface ProjectionDetail {
  label: string;
  image: string;
  timeframe: string;
  est_bmi: string;
  est_weight: string;
  expected_changes: string[];
}

export interface GetProjectionResponse {
  success: boolean;
  title: string;
  subtitle: string;
  input_image: string;
  data: {
    current_lifestyle: ProjectionDetail;
    future_goal: ProjectionDetail;
  };
}

export const projectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectionById: builder.query<GetProjectionResponse, number | string>({
      query: (id) => ({
        url: `/projections/${id}`,
        method: "GET",
      }),
      providesTags: ["Projection"],
    }),
    getLatestProjection: builder.query<GetProjectionResponse, number | string>({
      query: (userId) => ({
        url: `/projections/latest/${userId}`,
        method: "GET",
      }),
      providesTags: ["Projection"],
    }),
  }),
});

export const { useGetProjectionByIdQuery, useGetLatestProjectionQuery } = projectionApi;
