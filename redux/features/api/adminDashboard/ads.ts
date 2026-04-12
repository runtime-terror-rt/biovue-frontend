import { baseApi } from "../../api/baseApi";

export const adsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAds: builder.query({
      query: () => "/ads/admin",
      providesTags: ["Ads"],
    }),
    createAd: builder.mutation({
      query: (formData: FormData) => ({
        url: "/ads",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Ads"],
    }),
    updateAd: builder.mutation({
      query: ({ id, formData }: { id: number; formData: FormData }) => ({
        url: `/ads`, // Backend uses the same POST route for updates 
        method: "POST", 
        body: formData,
      }),
      invalidatesTags: ["Ads"],
    }),
    deleteAd: builder.mutation({
      query: (id: number) => ({
        url: `/ads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ads"],
    }),
    toggleAdStatus: builder.mutation({
      query: (id: number) => ({
        url: `/ads/toggle-status/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Ads"],
    }),
  }),
});

export const {
  useGetAdminAdsQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
  useToggleAdStatusMutation,
} = adsApi;
