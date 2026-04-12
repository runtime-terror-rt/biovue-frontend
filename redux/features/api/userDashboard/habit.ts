import { baseApi } from "../baseApi";


export const cardDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCardData: builder.query<any, void>({
      query: () => "/get-card-data",
      providesTags: ["Habit"],
    }),
    getHabits: builder.query<any, number | string>({
      query: (id) => `/habits/${id}`,
      providesTags: ["Habit"],
    }),
    updateHabits: builder.mutation<any, { user_id: number | string }>({
      query: (body) => ({
        url: "/habits/update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Habit"],
    }),
  }),
});

export const { 
  useGetCardDataQuery, 
  useGetHabitsQuery, 
  useUpdateHabitsMutation 
} = cardDataApi;
