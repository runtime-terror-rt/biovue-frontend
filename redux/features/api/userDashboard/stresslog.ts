import { baseApi } from "../baseApi";

export const stressLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStressLogs: builder.query<any, void>({
      query: () => "/stress-logs",
      providesTags: ["Reports"],
    }),
    postStressLog: builder.mutation<any, any>({
      query: (data) => ({
        url: "/stress-logs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reports", "Habit"],
    }),
    getStressReport: builder.query<any, number | void>({
      query: (days) => (days ? `/stress-report?days=${days}` : "/stress-report"),
      providesTags: ["Reports"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStressLogsQuery,
  usePostStressLogMutation,
  useGetStressReportQuery,
} = stressLogApi;
