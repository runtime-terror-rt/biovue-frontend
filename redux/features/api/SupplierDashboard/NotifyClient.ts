"use client";

import { baseApi } from "../baseApi";

export interface NotifyClientPayload {
  user_id: number;
  subject: string;
  message: string;
}

export interface NotifyClientResponse {
  success: boolean;
  message: string;
}

export const notifyClientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    notifyClient: builder.mutation<NotifyClientResponse, NotifyClientPayload>({
      query: (body) => ({
        url: "/supplier/notify-client",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useNotifyClientMutation } = notifyClientApi;
