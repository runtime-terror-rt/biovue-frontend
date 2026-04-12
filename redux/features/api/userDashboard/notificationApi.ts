import { baseApi } from "../baseApi";

export interface Notification {
  id: string;
  title: string | null;
  type: string | null;
  message: string;
  created_at: string;
  created_at_formatted: string;
  read_at: string | null;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: Notification[];
}

export interface NotificationSettings {
  id: number;
  user_id: number;
  coach_messages: number;
  client_messages: number;
  goal_updates: number;
  ai_insights: number;
  missed_checkin_alerts: number;
  program_milestone_updates: number;
  weekly_summary_email: number;
  auto_remind_missed_checkins: number;
  default_reminder_time: string;
  check_in_reminder_alerts: number;
  subscription_updates: number;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettingsResponse {
  status: string;
  data: NotificationSettings;
}

export interface UpdateNotificationSettingsRequest {
  [key: string]: number | string; 
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationResponse, void>({
      query: () => "/notification-list-by-user",
      providesTags: ["Notifications"],
    }),
    getNotificationSettings: builder.query<NotificationSettingsResponse, void>({
      query: () => "/user/notification",
      providesTags: ["NotificationSettings"],
    }),
    updateNotificationSettings: builder.mutation<NotificationSettingsResponse, UpdateNotificationSettingsRequest>({
      query: (body) => ({
        url: "/user/notification-settings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NotificationSettings"],
    }),
    markAsRead: builder.mutation<any, { notification_id?: string; all?: boolean }>({
      query: () => ({
        url: "/all-notification-mark-as-read",
        method: "GET",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markSingleAsRead: builder.mutation<any, { notification_id: string }>({
      query: (body) => ({
        url: "/mark-single-as-read",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteSingleNotification: builder.mutation<any, { notification_id: string }>({
      query: (body) => ({
        url: "/delete-single-notification",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteAllNotifications: builder.mutation<any, void>({
      query: () => ({
        url: "/delete-all-notification",
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { 
  useGetNotificationsQuery, 
  useMarkAsReadMutation, 
  useMarkSingleAsReadMutation, 
  useDeleteSingleNotificationMutation, 
  useDeleteAllNotificationsMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation
} = notificationApi;
