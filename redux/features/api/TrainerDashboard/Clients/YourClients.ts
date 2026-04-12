"use client";

import { baseApi } from "../../baseApi";

export interface Client {
  id: number;
  name: string;
  email: string;
  image_url: string | null;
  pivot: {
    profession_id: number;
    user_id: number;
  };
}

export interface ConnectedClientsResponse {
  success: boolean;
  message: string;
  current_user: {
    id: number;
    type: string;
  };
  count: number;
  data: Client[];
}

// Create an API slice for connected clients
export const yourClientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConnectedClients: builder.query<ConnectedClientsResponse, void>({
      query: () => ({
        url: "/connected-professions",
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),
  }),
  overrideExisting: false,
});

// Export the hook for usage in components
export const { useGetConnectedClientsQuery } = yourClientsApi;
