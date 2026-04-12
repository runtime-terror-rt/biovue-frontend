"use client";

import { baseApi } from "../../baseApi";

export interface CreateSchedulePayload {
  id?: number;
  client_id: number;
  date: string;
  time: string;
  check_in_type: string;
  private_note: string;
  status?: "scheduled" | "missed" | "completed";
}

export interface CreateScheduleResponse {
  message: string;
}

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSchedule: builder.mutation<
      CreateScheduleResponse,
      CreateSchedulePayload
    >({
      query: (body) => ({
        url: "/schedule-checkin",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Schedule", id: "LIST" }, "Clients"],
    }),

    updateSchedule: builder.mutation<
      CreateScheduleResponse,
      CreateSchedulePayload
    >({
      query: ({ id, ...body }) => ({
        url: `/schedule-checkin/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Schedule", id: "LIST" }, "Clients"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateScheduleMutation, useUpdateScheduleMutation } =
  scheduleApi;
