import { baseApi } from "./baseApi";

export interface Ad {
  id: number;
  ads_title: string;
  ads_type: string;
  image: string;
  placement: string;
  start_date: string;
  end_date: string;
  status: number;
  created_at: string;
  updated_at: string;
  redirect_link: string;
}

export interface AdsResponse {
  success: boolean;
  data: Ad[];
}

export const activeAdsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveAds: builder.query<Ad[], void>({
      query: () => ({
        url: "/ads",
        method: "GET",
      }),

      providesTags: ["Ads"],

      transformResponse: (response: AdsResponse): Ad[] => {
        if (!response?.data) return [];

        const today = new Date();

        return response.data.filter((ad) => {
          const startDate = new Date(ad.start_date);
          const endDate = new Date(ad.end_date);

          return ad.status === 1 && startDate <= today && endDate >= today;
        });
      },
    }),
  }),
});

export const { useGetActiveAdsQuery } = activeAdsApi;
