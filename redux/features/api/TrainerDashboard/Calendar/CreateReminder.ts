"use client";

import { baseApi } from "../../baseApi";

export interface CreateReminderRequest {
  client_id: number;
  reminder_type: string;
  message: string;
  in_app: boolean;
  push_notification: boolean;
}

export interface CreateReminderResponse {
  message: string;
}

export const reminderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReminder: builder.mutation<
      CreateReminderResponse,
      CreateReminderRequest
    >({
      query: (body) => ({
        url: "/send-reminder",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const { useCreateReminderMutation } = reminderApi;
