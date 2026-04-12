import { baseApi } from "../baseApi";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendedProfessionals: builder.query<any, string | number>({
      query: (userId) => `/recommend/professionals/${userId}`,
    }),
    getConnectedProfessions: builder.query<any, void>({
      query: () => "/connected-professions",
      providesTags: ["SupportTeam"],
    }),
    connectProfession: builder.mutation<any, { profession_id: number }>({
      query: (body) => ({
        url: "/connect-profession",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SupportTeam"],
    }),
    getCurrentImage: builder.query<any, void>({
      query: () => "/user/current-image",
      providesTags: ["SupportImage" as any],
    }),
    updateLifestyleImage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/user/update-current-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["SupportImage" as any],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetRecommendedProfessionalsQuery,
  useGetConnectedProfessionsQuery,
  useConnectProfessionMutation,
  useUpdateLifestyleImageMutation,
  useGetCurrentImageQuery
} = supportApi;
