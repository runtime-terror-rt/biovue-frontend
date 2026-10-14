import { baseApi } from "../baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserOverviewChart: builder.query<any, number>({
      query: (days) => `/user-overview-chart?days=${days}`,
      providesTags: ["Habit", "HealthHabitOverview", "Reports", "SleepLog", "Hydration", "Nutrition"],
    }),
  }),
});

export const { useGetUserOverviewChartQuery } = dashboardApi;
