import { baseApi } from "../../baseApi";

export interface ProjectionLimitResponse {
  success: boolean;
  projection_limit: number;
  member_limit: number;
  expired_at: string;
}

export const projectionLimitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectionLimit: builder.query<ProjectionLimitResponse, void>({
      query: () => "/projections/limit-expired",
      providesTags: ["Projection"],
    }),
  }),
});

export const { useGetProjectionLimitQuery } = projectionLimitApi;