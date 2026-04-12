import { projectionApi } from "./Projection/projectionApi";

export const nutritionAiApi = projectionApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiSuggestedTarget: builder.query<any, string | number>({
      query: (user_id) => `/habits/nutritions/ai-suggested-target/saved/?user_id=${user_id}`,
      providesTags: ["Projection"] as any,
    }),
    updateAiSuggestedTarget: builder.mutation<any, { user_id: string | number }>({
      query: (data) => ({
        url: "/habits/nutritions/ai-suggested-target/",
        method: "POST",
        body: { user_id: data.user_id.toString() },
      }),
      invalidatesTags: ["Projection"] as any,
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetAiSuggestedTargetQuery, 
  useUpdateAiSuggestedTargetMutation 
} = nutritionAiApi;
