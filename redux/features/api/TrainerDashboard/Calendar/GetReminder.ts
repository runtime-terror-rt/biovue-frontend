import { baseApi } from "../../baseApi";

export interface Reminder {
  id: number;
  sender_id: number;
  client_id: number;
  reminder_type: "habit" | "motivation" | string;
  message: string;
  in_app: number;
  push_notification: number;
  created_at: string;
  updated_at: string;
}

export interface GetRemindersResponse {
  status: string;
  message: string;
  data: Reminder[];
}

export const remindersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReminders: builder.query<GetRemindersResponse, void>({
      query: () => ({
        url: "/my-reminders",
        method: "GET",
      }),
      providesTags: ["Reminders"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRemindersQuery } = remindersApi;
