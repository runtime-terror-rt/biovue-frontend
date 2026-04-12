import { projectionApi } from "../userDashboard/Projection/projectionApi";

export const recommendationApi = projectionApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfessionalRecommendations: builder.mutation<any, { user_id: string | number }>({
      query: (data) => ({
        url: "/recommend/professionals/",
        method: "POST",
        body: { user_id: data.user_id.toString() },
      }),
    }),
    updateTrainerUserRecommendations: builder.mutation<any, { trainer_id: string | number }>({
      query: (data) => ({
        url: "/recommend/users/trainer/",
        method: "POST",
        body: { trainer_id: data.trainer_id.toString() },
      }),
    }),
    updateNutritionistUserRecommendations: builder.mutation<any, { nutritionist_id: string | number }>({
      query: (data) => ({
        url: "/recommend/users/nutritionist/",
        method: "POST",
        body: { nutritionist_id: data.nutritionist_id.toString() },
      }),
    }),
    updateSupplierUserRecommendations: builder.mutation<any, { supplier_id: string | number }>({
      query: (data) => ({
        url: "/recommend/users/supplier/",
        method: "POST",
        body: { supplier_id: data.supplier_id.toString() },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useUpdateProfessionalRecommendationsMutation,
  useUpdateTrainerUserRecommendationsMutation,
  useUpdateNutritionistUserRecommendationsMutation,
  useUpdateSupplierUserRecommendationsMutation,
} = recommendationApi;
