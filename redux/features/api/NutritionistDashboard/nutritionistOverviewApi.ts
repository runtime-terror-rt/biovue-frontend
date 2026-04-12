"use client";

import { baseApi } from "../baseApi";

export interface StatItem {
  value: number;
  label: string;
}

export interface NutritionistStats {
  active_clients: StatItem;
  needing_attention: StatItem;
  pending_messages: StatItem;
  todays_checkins: StatItem;
}

export interface ClientTableItem {
  user_name: string;
  goal: string;
  projection_used: string;
  status: string;
  activity: string;
  user_id: number;
}

export interface TodayAction {
  title: string;
  desc: string;
  link: string;
}

export interface NutritionistOverviewResponse {
  success: boolean;
  stats: NutritionistStats;
  client_table: ClientTableItem[];
  today_actions: TodayAction[];
}

export const nutritionistOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNutritionistOverview: builder.query<NutritionistOverviewResponse, void>({
      query: () => ({
        url: "/trainer-overview", // Reusing the same endpoint for now or check if /nutritionist-overview exists
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),
  }),
});

export const { useGetNutritionistOverviewQuery } = nutritionistOverviewApi;
