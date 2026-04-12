import { baseApi } from "../baseApi";

export interface Plan {
  id: number;
  name: string;
  plan_type: "individual" | "professional";
  billing_cycle: string;
  duration: number;
  member_limit: number | null;
  features: string[];
  status: boolean;
  price: string | number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], string | void>({
      query: (billing) => (billing ? `/plans?billing=${billing}` : "/plans"),
      transformResponse: (response: ApiResponse<Plan[]>) => response.data,
      providesTags: ["Plans"],
    }),
    getPlan: builder.query<Plan, number>({
      query: (id) => `/plans/${id}`,
      transformResponse: (response: ApiResponse<Plan>) => response.data,
      providesTags: (result, error, id) => [{ type: "Plans", id }],
    }),
    createPlan: builder.mutation<Plan, Partial<Plan>>({
      query: (body) => ({
        url: "/plans/store-or-update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Plans"],
    }),
    updatePlan: builder.mutation<Plan, Partial<Plan>>({
      query: (body) => ({
        url: "/plans/store-or-update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Plans"],
    }),
    deletePlan: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPlansQuery,
  useGetPlanQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = planApi;

export default planApi;
