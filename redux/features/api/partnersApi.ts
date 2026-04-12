import { baseApi } from "./baseApi";

export const partnersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query({
      query: () => "/partners",
      providesTags: ["Partners"],
    }),
    getSinglePartner: builder.query({
      query: (id) => `/partners/${id}`,
      providesTags: (result, error, id) => [{ type: "Partners", id }],
    }),
    createPartner: builder.mutation({
      query: (data) => ({
        url: "/partners",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Partners"],
    }),
    updatePartner: builder.mutation({
      query: ({ id, data }) => ({
        url: `/partners/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Partners",
        { type: "Partners", id },
      ],
    }),
    deletePartner: builder.mutation({
      query: (id) => ({
        url: `/partners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Partners"],
    }),
  }),
});

export const {
  useGetPartnersQuery,
  useGetSinglePartnerQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = partnersApi;
