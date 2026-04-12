"use client";

import { baseApi } from "../../baseApi";

export interface SupplierDashboardStats {
  total_products: number;
  active_products: number;
  draft_products: number;
  total_orders: number;
}

export interface RecentProduct {
  id: number;
  product_image: string | null;
  product_name: string;
  redirect_url: string;
  status: string;
  price: string;
}

export interface SupplierDashboardResponse {
  success: boolean;
  stats: SupplierDashboardStats;
  recent_products: RecentProduct[];
}

export const supplierOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierDashboard: builder.query<SupplierDashboardResponse, void>({
      query: () => ({
        url: "/supplyer-dashboard",
        method: "GET",
      }),
      providesTags: ["SupplierDashboard"],
    }),
  }),
});

export const { useGetSupplierDashboardQuery } = supplierOverviewApi;
