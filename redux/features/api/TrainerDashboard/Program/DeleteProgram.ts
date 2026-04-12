"use client";

import { baseApi } from "../../baseApi";

export interface DeleteProgramResponse {
  status: boolean;
  message: string;
}

export interface DeleteProgramRequest {
  id: number;
}

export const deleteProgramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteProgram: builder.mutation<DeleteProgramResponse, number>({
      query: (id) => ({
        url: `/program-sets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Programs"], 
    }),
  }),
});

export const { useDeleteProgramMutation } = deleteProgramApi;
