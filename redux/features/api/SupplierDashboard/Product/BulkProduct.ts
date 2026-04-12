"use client";

import { baseApi } from "../../baseApi";

export interface BulkProductResponse {
  success: boolean;
  message: string;
}

export const bulkProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    bulkUploadProducts: builder.mutation<BulkProductResponse, FormData>({
      query: (formData) => ({
        url: "/products/bulk-upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const { useBulkUploadProductsMutation } = bulkProductApi;
