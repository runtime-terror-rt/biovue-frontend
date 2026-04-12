"use client";

import { baseApi } from "../../baseApi";

// Response types
export interface ScheduleClientProfile {
  user_id: number;
  image: string | null;
}

export interface ScheduleClient {
  id: number;
  name: string;
  image_url: string | null;
  profile: ScheduleClientProfile;
}

export interface ScheduleItem {
  id: number;
  trainer_id: number;
  client_id: number;
  schedule_date: string;
  schedule_time: string;
  check_in_type: string;
  private_note: string;
  status: string;
  created_at: string;
  updated_at: string;
  client: ScheduleClient;
}

export interface GetSchedulesResponse {
  status: string;
  data: ScheduleItem[];
}

// RTK Query endpoint
export const getSchedulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query<GetSchedulesResponse, void>({
      query: () => ({
        url: `/calendar-schedules`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({ type: "Schedule" as const, id })),
              { type: "Schedule", id: "LIST" },
            ]
          : [{ type: "Schedule", id: "LIST" }],
    }),
  }),
});

export const { useGetSchedulesQuery } = getSchedulesApi;
