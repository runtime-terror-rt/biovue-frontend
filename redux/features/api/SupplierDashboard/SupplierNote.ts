"use client";

import { baseApi } from "../baseApi";

export interface AddSupplierNoteRequest {
  user_id: number;
  note: string;
}

export interface AddSupplierNoteResponse {
  success: boolean;
  message: string;
  note_id: number;
}

export interface SupplierNote {
  id: number;
  profession_id: number;
  user_id: number;
  note_category: string | null;
  note: string;
  created_at: string;
  updated_at: string;
  profession_name: string;
}

export interface GetSupplierNotesResponse {
  success: boolean;
  data: SupplierNote[];
}

export interface DeleteSupplierNoteResponse {
  success: boolean;
  message: string;
}

export const supplierNoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSupplierNote: builder.mutation<
      AddSupplierNoteResponse,
      AddSupplierNoteRequest
    >({
      query: (body) => ({
        url: "/trainer-notes",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { user_id }) => [
        { type: "SupplierNote", id: user_id },
      ],
    }),

    getSupplierNotes: builder.query<GetSupplierNotesResponse, number>({
      query: (user_id) => ({
        url: `/trainer-notes/${user_id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, user_id) => [
        { type: "SupplierNote", id: user_id },
      ],
    }),

    deleteSupplierNote: builder.mutation<
      DeleteSupplierNoteResponse,
      { note_id: number; user_id: number }
    >({
      query: ({ note_id }) => ({
        url: `/trainer-notes/${note_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { user_id }) => [
        { type: "SupplierNote", id: user_id },
      ],
    }),

    updateSupplierNote: builder.mutation<
      DeleteSupplierNoteResponse,
      { note_id: number; note: string; user_id: number }
    >({
      query: ({ note_id, note }) => ({
        url: `/trainer-notes/${note_id}`,
        method: "PATCH",
        body: { note },
      }),
      invalidatesTags: (_result, _error, { user_id }) => [
        { type: "SupplierNote", id: user_id },
      ],
    }),
  }),
});

export const {
  useAddSupplierNoteMutation,
  useGetSupplierNotesQuery,
  useDeleteSupplierNoteMutation,
  useUpdateSupplierNoteMutation,
} = supplierNoteApi;
