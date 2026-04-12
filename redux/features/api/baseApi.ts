import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState, endpoint }: any) => {
      console.log("Preparing headers for API call, endpoint:", endpoint);

      // Skip auth header for login and register endpoints
      if (endpoint === "login" || endpoint === "register") {
        console.log(`Skipping authorization header for ${endpoint}`);
      } else {
        const token = (getState() as any).auth.token;
        if (token) {
          console.log("Token found, adding to headers");
          headers.set("authorization", `Bearer ${token}`);
        } else {
          console.warn("No token found in auth state");
        }
      }

      // Add ngrok skip warning header for development
      headers.set("ngrok-skip-browser-warning", "any");
      // headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Plans",
    "Reports",
    "SleepLog",
    "Nutrition",
    "Hydration",
    "Ads",
    "Programs",
    "Messages",
    "Clients",
    "Schedule",
    "Insights",
    "Profile",
    "TargetGoals",
    "HealthHabitOverview",
    "Habit",
    "Supplier",
    "SupplierDashboard",
    "ChangePassword",
    "Projection",
    "SupportTeam",
    "FAQ",
    "Notifications",
    "Partners",
    "Privacy",
    "NotificationSettings",
    "BulkProduct",
    "SupplierNote",
    "SupportImage",
    "Invitation",
  ],

  endpoints: () => ({}),
});
