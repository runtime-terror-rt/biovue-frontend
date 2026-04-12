import { baseApi } from "../baseApi";

export const sleepLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSleepLogs: builder.query<any, void>({
      query: () => "/sleep-logs",
      providesTags: ["SleepLog"],
    }),
    postSleepLog: builder.mutation<any, any>({
      query: (data) => ({
        url: "/sleep-logs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SleepLog", "Habit"],
    }),
    getSleepReport: builder.query<any, number | void>({
      query: (days) => (days ? `/sleep-report?days=${days}` : "/sleep-report"),
      providesTags: ["SleepLog"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSleepLogsQuery,
  usePostSleepLogMutation,
  useGetSleepReportQuery,
} = sleepLogApi;
