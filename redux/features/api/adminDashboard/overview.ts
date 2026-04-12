import { baseApi } from "../baseApi";

const adminOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query({
      query: () => "/admin/overview",
    }),
  }),
});

export const { useGetAdminOverviewQuery } = adminOverviewApi;

export default adminOverviewApi;
