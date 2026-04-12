"use client";

import { baseApi } from "../baseApi";

export interface StatItem {
  value: number;
  label: string;
}

export interface TrainerStats {
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

export interface TrainerOverviewResponse {
  success: boolean;
  stats: TrainerStats;
  client_table: ClientTableItem[];
  today_actions: TodayAction[];
}

export const trainerOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrainerOverview: builder.query<TrainerOverviewResponse, void>({
      query: () => ({
        url: "/trainer-overview",
        method: "GET",
      }),
      providesTags: ["Clients"], // Using Clients tag to refresh when clients change
    }),
  }),
});

export const { useGetTrainerOverviewQuery } = trainerOverviewApi;
