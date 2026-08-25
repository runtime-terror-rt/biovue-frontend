import { baseApi } from "./baseApi";

export interface ExternalApiResponse {
  success: boolean;
  data: {
    api_key: string;
    projection_limit: number;
    insite_limit: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    expires_in_days: number;
  };
}

export interface AdminExternalApiData {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  api_key: string;
  projection_limit: number;
  insite_limit: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  expires_in_days: number;
  created_at: string;
}

export interface AdminExternalApiResponse {
  success: boolean;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  data: AdminExternalApiData[];
}

export const externalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExternalApi: builder.query<ExternalApiResponse, void>({
      query: () => "/external-api",
      providesTags: ["Profile"],
    }),
    getAdminExternalApis: builder.query<
      AdminExternalApiResponse,
      { page?: number; per_page?: number }
    >({
      query: ({ page = 1, per_page = 10 } = {}) =>
        `/admin/external-apis?page=${page}&per_page=${per_page}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetExternalApiQuery, useGetAdminExternalApisQuery } = externalApi;

export default externalApi;
