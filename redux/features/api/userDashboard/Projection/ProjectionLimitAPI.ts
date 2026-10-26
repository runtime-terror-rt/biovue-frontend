import { baseApi } from "../../baseApi";

export interface ProjectionLimitResponse {
  success: boolean;
  projection_limit: number;
  member_limit: number;
  expired_at: string;
  used_seats?: number;
  total_seats?: number;
  remaining_seats?: number;
  seats_ratio?: string;
  seats_left?: number;
  seats_left_text?: string;
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