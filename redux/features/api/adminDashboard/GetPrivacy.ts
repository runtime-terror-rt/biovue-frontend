"use client";

import { baseApi } from "../baseApi";

export interface PrivacyItem {
  id: number;
  heading: string;
  content: string;
}

export interface GetPrivacyResponse {
  success: boolean;
  data: {
    id: number;
    title: string;
    content: PrivacyItem[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export const getPrivacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacy: builder.query<GetPrivacyResponse, void>({
      query: () => ({
        url: "/privacy-policy",
        method: "GET",
      }),
      providesTags: ["Privacy"],
    }),
  }),
});

export const { useGetPrivacyQuery } = getPrivacyApi;
