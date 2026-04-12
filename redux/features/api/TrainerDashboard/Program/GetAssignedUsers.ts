"use client";

import { baseApi } from "@/redux/features/api/baseApi";

export interface ProgramUser {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
  enrolled_at: string | null;
}

export interface GetAssignedUsersResponse {
  success: boolean;
  program_name: string;
  total_users: number;
  users: ProgramUser[];
}

export const assignedUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssignedUsers: builder.query<GetAssignedUsersResponse, number>({
      query: (programId) => ({
        url: `/program-users/${programId}`,
        method: "GET",
      }),
      providesTags: ["Programs"],
    }),
  }),
});

export const { useGetAssignedUsersQuery } = assignedUsersApi;
