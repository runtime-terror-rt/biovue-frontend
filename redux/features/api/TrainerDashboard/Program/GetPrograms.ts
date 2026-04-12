import { baseApi } from "../../baseApi";

export interface Program {
  id: number;
  name: string;
  duration: number;
  primary_goal: string;
  target_intensity: string;
  description?: string | null;
  notes?: string | null;
  weekly_targets?: string | null;
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
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetProgramsResponse {
  status: boolean;
  data: Program[];
}

export const programsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrograms: builder.query<GetProgramsResponse, void>({
      query: () => ({
        url: "/program-sets",
        method: "GET",
      }),
      providesTags: ["Programs"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProgramsQuery } = programsApi;
