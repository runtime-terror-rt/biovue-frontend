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
      invalidatesTags: ["Nutrition", "Habit", "HealthHabitOverview", "Reports"],
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
      invalidatesTags: ["Nutrition", "Habit", "HealthHabitOverview", "Reports"],
    }),
    getNutritionShow: builder.query({
      query: (params?: any) => {
        if (!params) return "/nutrition/show";
        if (typeof params === "string") return `/nutrition/show?date=${params}`;
        const queryParams = new URLSearchParams();
        if (params.date) queryParams.append("date", params.date);
        if (params.user_id) queryParams.append("user_id", String(params.user_id));
        const str = queryParams.toString();
        return str ? `/nutrition/show?${str}` : "/nutrition/show";
      },
      providesTags: ["Nutrition"],
    }),
    deleteFood: builder.mutation<
      any,
      { user_id: number; log_date: string; food: string }
    >({
      query: (body) => ({
        url: "/nutrition/delete-food",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Nutrition", "Habit", "HealthHabitOverview", "Reports"],
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
  useDeleteFoodMutation,
} = nutritionApi;
