import { baseApi } from "../baseApi";

export const hydrationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHydrationLogs: builder.query({
      query: () => "/hydration-logs",
      providesTags: ["Hydration"],
    }),
    getSingleHydrationLog: builder.query({
      query: (id) => `/hydration-logs/${id}`,
      providesTags: (result, error, id) => [{ type: "Hydration", id }],
    }),
    postHydrationLog: builder.mutation({
      query: (body) => ({
        url: "/hydration-logs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Hydration", "Habit"],
    }),
    getHydrationReport: builder.query<any, number | void>({
      query: (days) => (days ? `/hydration-report?days=${days}` : "/hydration-report"),
      providesTags: ["Hydration"],
    }),
  }),
});

export const {
  useGetHydrationLogsQuery,
  useGetSingleHydrationLogQuery,
  usePostHydrationLogMutation,
  useGetHydrationReportQuery,
} = hydrationApi;
