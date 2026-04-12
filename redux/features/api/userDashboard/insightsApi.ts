import { baseApi } from "../baseApi";

const insightsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInsights: builder.query({
      query: () => "/insights",
      providesTags: ["Insights"],
    }),
    getFutureInsights: builder.query({
      query: () => "/future-insights",
      providesTags: ["Insights"],
    }),
    fetchInsights: builder.mutation({
      query: (data) => ({
        url: "/insights/fetch",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Insights"],
    }),
    fetchFutureInsights: builder.mutation({
      query: (data) => ({
        url: "/future-insights/fetch",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Insights"],
    }),
  }),
});

export const { 
  useGetInsightsQuery, 
  useGetFutureInsightsQuery,
  useFetchInsightsMutation,
  useFetchFutureInsightsMutation
} = insightsApi;

export default insightsApi;
