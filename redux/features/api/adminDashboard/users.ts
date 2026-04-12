import { baseApi } from "../baseApi";

const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),
    deleteAdminUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetAdminUsersQuery, useDeleteAdminUserMutation } = adminUsersApi;

export default adminUsersApi;
