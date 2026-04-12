import { projectionApi } from "./projectionApi";

export const aiHabitsApi = projectionApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiSavedHabits: builder.query<any, string | number>({
      query: (user_id) => `/habits/update/saved/?user_id=${user_id}`,
      // We can use any tag here to invalidate, but Projection is configured in projectionApi
      providesTags: ["Projection"] as any, 
    }),
    updateAiHabits: builder.mutation<any, { user_id: string | number }>({
      query: (data) => ({
        url: "/habits/update/",
        method: "POST",
        body: { user_id: data.user_id.toString() },
      }),
      invalidatesTags: ["Projection"] as any,
    }),
  }),
  overrideExisting: true,
});

export const { useGetAiSavedHabitsQuery, useUpdateAiHabitsMutation } = aiHabitsApi;
