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
      query: (days) => {
        let type = "weekly";
        if (days === 30) type = "monthly";
        if (days === 90) type = "3_months";
        return `/nutrition-report?type=${type}`;
      },
      providesTags: ["Nutrition"],
    }),
    calculateNutrition: builder.mutation({
      query: (body) => ({
        url: "/nutrition/calculate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Nutrition", "Habit"],
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
