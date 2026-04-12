import { baseApi } from "../../baseApi";

export interface CreateProgramBody {
  name: string;
  duration: number;
  primary_goal: string;
  target_intensity: string;
  habit_focus_areas: string[];
  program_focus: string[];
  focus_areas: string[];
  habit_focus: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  supplement_recommendation: string[];
  supplement: string[];
}

export const createProgramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProgram: builder.mutation({
      query: (body: CreateProgramBody) => ({
        url: "/program-sets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Programs"],
    }),
  }),
});

export const { useCreateProgramMutation } = createProgramApi;
