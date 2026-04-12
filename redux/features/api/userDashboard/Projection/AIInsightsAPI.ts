import { projectionApi } from "./projectionApi";

export const aiInsightsApi = projectionApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiCurrentInsights: builder.query<any, string | number>({
      query: (user_id) => `/insights/current/saved/?user_id=${user_id}`,
      providesTags: ["Projection"] as any,
    }),
    getAiFutureInsights: builder.query<any, string | number>({
      query: (user_id) => `/insights/future/saved/?user_id=${user_id}`,
      providesTags: ["Projection"] as any,
    }),
    updateAiCurrentInsights: builder.mutation<any, { user_id: string | number }>({
      query: (data) => ({
        url: "/insights/current/",
        method: "POST",
        body: { user_id: data.user_id.toString() },
      }),
      invalidatesTags: ["Projection"] as any,
    }),
    updateAiFutureInsights: builder.mutation<any, { user_id: string | number; timeframe?: string }>({
      query: (data) => ({
        url: "/insights/future/",
        method: "POST",
        body: { 
          user_id: data.user_id.toString(),
          timeframe: data.timeframe || "5 years" 
        },
      }),
      invalidatesTags: ["Projection"] as any,
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetAiCurrentInsightsQuery, 
  useGetAiFutureInsightsQuery,
  useUpdateAiCurrentInsightsMutation,
  useUpdateAiFutureInsightsMutation
} = aiInsightsApi;
