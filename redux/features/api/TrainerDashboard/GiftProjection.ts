"use client";

import { baseApi } from "../baseApi";

export interface GiftCreditRequest {
  receiver_ids: number[];
  amount: number;
}

export interface GiftCreditResponse {
  success: boolean;
  message: string;
  total_deducted: number;
  remaining_credit: number;
}

export const giftProjectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    giftCredit: builder.mutation<GiftCreditResponse, GiftCreditRequest>({
      query: (body) => ({
        url: "/gift-credit",
        method: "POST",
        body,
      }),

      invalidatesTags: ["GiftProjection", "Users"],
    }),
  }),
});

export const { useGiftCreditMutation } = giftProjectionApi;
