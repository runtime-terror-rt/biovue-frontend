"use client";

import { AiApi } from "./AiApi";

export interface MatchedProduct {
  product_id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  image: string | null;
  redirect_url: string;
  match_score: number;
  match_reason: string;
  health_benefits: string[];
  warnings: string[] | null;
}

export interface FindMatchResponse {
  user_id: string;
  supplier_id: string;
  supplier_name: string;
  matched_products: MatchedProduct[];

  recommendation_summary: string;
  profile_completeness: number;
  completeness_warning: string;

  total_products_analysed: number;
  match_quality: string;
}

export interface FindMatchRequest {
  user_id: string;
  supplier_id: string;
  user_data?: any;
}

export const findMatchApi = AiApi.injectEndpoints({
  endpoints: (builder) => ({
    findMatch: builder.mutation<FindMatchResponse, FindMatchRequest>({
      query: (body) => ({
        url: "/recommend/users/find-match/",
        method: "POST",
        body: {
          user_id: body.user_id,
          supplier_id: body.supplier_id,
          user_data: body.user_data,
        },
      }),

      invalidatesTags: ["FindMatch"],
    }),

    getSavedMatch: builder.query<FindMatchResponse, FindMatchRequest>({
      query: ({ user_id, supplier_id }) => ({
        url: `/recommend/users/find-match/saved/?user_id=${user_id}&supplier_id=${supplier_id}`,
        method: "GET",
      }),

      providesTags: ["FindMatch"],
    }),
  }),
});

export const { useFindMatchMutation, useGetSavedMatchQuery, useLazyGetSavedMatchQuery } = findMatchApi;
