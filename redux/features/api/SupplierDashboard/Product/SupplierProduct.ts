"use client";

import { baseApi } from "../../baseApi";

export interface Product {
  id: number;
  supplier_id: number;
  name: string;
  description: string;
  image: string | null;
  category: string;
  price: string;
  redirect_url: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  price: string;
  redirect_url: string;
  status: string;
  image?: File;
}

export interface UpdateProductPayload {
  id: number;
  data: CreateProductPayload;
}

export const supplierProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all products
    getSupplierProducts: builder.query<ProductsResponse, void>({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["Supplier"],
    }),

    // CREATE product
    createSupplierProduct: builder.mutation<
      ProductResponse,
      CreateProductPayload
    >({
      query: (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
          }
        });

        return {
          url: "/products",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Supplier"],
    }),

    // UPDATE product
    updateSupplierProduct: builder.mutation<
      ProductResponse,
      UpdateProductPayload
    >({
      query: ({ id, data }) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
          }
        });

        return {
          url: `/products/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Supplier"],
    }),

    // DELETE product
    deleteSupplierProduct: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useGetSupplierProductsQuery,
  useCreateSupplierProductMutation,
  useUpdateSupplierProductMutation,
  useDeleteSupplierProductMutation,
} = supplierProductApi;
