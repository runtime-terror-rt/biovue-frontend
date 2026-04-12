"use client";

import { baseApi } from "../../baseApi";

export interface ProgramContext {
  program_name: string;
  duration: string;
  primary_goal: string;
  intensity: string;
}

export interface ProgramContextResponse {
  success: boolean;
  data: ProgramContext;
}

export const clientOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientProgramContext: builder.query<ProgramContextResponse, number>({
      query: (clientId) => ({
        url: `/program-context/${clientId}`,
        method: "GET",
      }),
      providesTags: ["Programs"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetClientProgramContextQuery } = clientOverviewApi;
