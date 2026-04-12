import { baseApi } from "../baseApi";

export const nutritionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNutritionLogs: builder.query({
      query: () => "/nutrition-logs",
      providesTags: ["Nutrition"],
    }),
    getSingleNutritionLog: builder.query({
      query: (id) => `/nutrition-logs/${id}`,
      providesTags: (result, error, id) => [{ type: "Nutrition", id }],
    }),
    postNutritionLog: builder.mutation({
      query: (body) => ({
        url: "/nutrition-logs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Nutrition", "Habit"],
    }),
    getNutritionReport: builder.query<any, number | void>({
      query: (days) => (days ? `/nutrition-report?days=${days}` : "/nutrition-report"),
      providesTags: ["Nutrition"],
    }),
    calculateNutrition: builder.mutation({
      query: (body) => ({
        url: "/nutrition/calculate",
        method: "POST",
        body,
      }),
    }),
    getNutritionShow: builder.query({
      query: () => "/nutrition/show",
      providesTags: ["Nutrition"],
    }),
  }),
});

export const {
  useGetNutritionLogsQuery,
  useGetSingleNutritionLogQuery,
  usePostNutritionLogMutation,
  useGetNutritionReportQuery,
  useCalculateNutritionMutation,
  useGetNutritionShowQuery,
} = nutritionApi;
