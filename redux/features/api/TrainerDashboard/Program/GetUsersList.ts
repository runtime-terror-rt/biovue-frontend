
"use client";

import { baseApi } from "../../baseApi";


export interface IndividualUser {
  id: number;
  name: string;
  email: string;
  image_url: string | null;
}

export interface GetUsersResponse {
  status: boolean;
  data: IndividualUser[];
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, void>({
      query: () => ({
        url: "/users/individuals",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery } = usersApi;
