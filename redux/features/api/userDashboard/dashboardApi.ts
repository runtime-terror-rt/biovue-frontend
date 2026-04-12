import { baseApi } from "../baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserOverviewChart: builder.query<any, number>({
      query: (days) => `/user-overview-chart?days=${days}`,
      providesTags: ["Habit"],
    }),
  }),
});

export const { useGetUserOverviewChartQuery } = dashboardApi;
