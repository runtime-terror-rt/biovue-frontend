import { AiApi } from "../SupplierDashboard/AiApi";

export const supportAiApi = AiApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiRecommendedProfessionals: builder.query<any, string | number>({
      query: (userId) => ({
        url: `/recommend/professionals/${userId}/saved/`,
        method: "GET",
      }),
      providesTags: ["Support"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAiRecommendedProfessionalsQuery } = supportAiApi;