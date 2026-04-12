import { baseApi } from "../baseApi";

interface TogglePlanStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    status: string;
  };
}

export const planStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    togglePlanStatus: builder.mutation<TogglePlanStatusResponse, number>({
      query: (id) => ({
        url: `/plans/toggle-status/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Plans"], // refresh plans list
    }),
  }),
  overrideExisting: false,
});

export const { useTogglePlanStatusMutation } = planStatusApi;
