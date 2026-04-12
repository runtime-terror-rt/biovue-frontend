"use client";

import { baseApi } from "../baseApi";

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const changePasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/change-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ChangePassword"],
    }),
  }),
});

export const { useChangePasswordMutation } = changePasswordApi;