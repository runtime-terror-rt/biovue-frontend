import { projectionApi } from "./Projection/projectionApi";

export const supportAiApi = projectionApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiRecommendedProfessionals: builder.query<any, string | number>({
      query: (userId) => `/recommend/professionals/${userId}/saved/`,
      providesTags: ["Projection"] as any,
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetAiRecommendedProfessionalsQuery 
} = supportAiApi;
