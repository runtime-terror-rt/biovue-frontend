"use client";

import { baseApi } from "../../baseApi";

export interface Nutrition {
  protein: number;
  carbs: number;
  fats: number;
}

export interface ChartData {
  label: string;
  weight: number | null;
  steps: number;
  sleep_hours: number;
  nutrition: Nutrition;
}

export interface HealthOverview {
  weight: {
    current: string;
    target: string;
  };
  steps: {
    avg: number;
    target: number;
  };
}

export interface ClientsChartResponse {
  success: boolean;
  client_name: string;
  charts: ChartData[];
  health_overview: HealthOverview;
}

export const clientsChartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserOverviewChart: builder.query<
      ClientsChartResponse,
      { userId: number; days?: number }
    >({
      query: ({ userId, days = 30 }) => ({
        url: `/user-overview-chart/${userId}`,
        method: "GET",
        params: { days },
      }),
      providesTags: ["Reports"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserOverviewChartQuery } = clientsChartApi;
