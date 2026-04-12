"use client";

import { baseApi } from "../../baseApi";

export interface AssignUsersRequest {
  program_set_id: number;
  user_ids: number[];
}

export interface AssignedUser {
  id: number;
  name: string;
  email: string;
  image_url: string | null;
  pivot: {
    program_set_id: number;
    user_id: number;
  };
}

export interface AssignUsersResponse {
  status: boolean;
  message: string;
  data: AssignedUser[];
}

export const assignProgramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    assignProgramUsers: builder.mutation<
      AssignUsersResponse,
      AssignUsersRequest
    >({
      query: (body) => ({
        url: "/program-sets/assign-users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Programs", "Clients"],
    }),
  }),
});

export const { useAssignProgramUsersMutation } = assignProgramApi;
