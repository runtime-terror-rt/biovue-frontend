import { baseApi } from "../../baseApi";
import { AssignedUser } from "./AssignProgram";

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
  users?: AssignedUser[];
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetProgramByIdResponse {
  status: boolean;
  data: Program;
}

export const programsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgramById: builder.query<GetProgramByIdResponse, number>({
      query: (id) => ({
        url: `/program-sets/${id}`,
        method: "GET",
      }),
      providesTags: ["Programs"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProgramByIdQuery } = programsApi;
