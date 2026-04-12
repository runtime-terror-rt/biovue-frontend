"use client";

import { baseApi } from "../baseApi";

export interface PrivacyItem {
  id: number;
  heading: string;
  content: string;
}

export interface CreatePrivacyPayload {
  title: string;
  is_active: boolean;
  items: PrivacyItem[];
}

export interface CreatePrivacyResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    content: PrivacyItem[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPrivacy: builder.mutation<
      CreatePrivacyResponse,
      CreatePrivacyPayload
    >({
      query: (data) => ({
        url: "/save-terms",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Privacy"],
    }),
  }),
});

export const { useCreatePrivacyMutation } = privacyApi;
