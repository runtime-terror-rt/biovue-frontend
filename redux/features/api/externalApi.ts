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

export const externalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExternalApi: builder.query<ExternalApiResponse, void>({
      query: () => "/external-api",
      providesTags: ["Profile"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetExternalApiQuery } = externalApi;

export default externalApi;
