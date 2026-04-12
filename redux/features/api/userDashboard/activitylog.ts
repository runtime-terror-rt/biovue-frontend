import { baseApi } from "../baseApi";

export const activityLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<any, void>({
      query: () => "/activity-logs",
      providesTags: ["Reports"],
    }),
    postActivityLog: builder.mutation<any, any>({
      query: (data) => ({
        url: "/activity-logs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reports", "Habit"],
    }),
    getActivityReport: builder.query<any, number | void>({
      query: (days) => (days ? `/activity-report?days=${days}` : "/activity-report"),
      providesTags: ["Reports"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetActivityLogsQuery,
  usePostActivityLogMutation,
  useGetActivityReportQuery,
} = activityLogApi;
