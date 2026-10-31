import { baseApi } from "../baseApi";

export interface Program {
  program_id: number;
  program_name: string;
  duration: number;
  primary_goal: string;
  target_intensity: string;
  created_by: string;
  assigned_date: string;
  description?: string;
  workout_routine?: string;
  notes?: string;
  workout_types?: string[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  supplement_recommendation?: string[];
  weekly_targets?: any;
  trainer_email?: string;
}

export interface GetProgramsResponse {
  success: boolean;
  total_connected_programs: number;
  data: Program[];
}

export const getProgramsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrograms: builder.query<GetProgramsResponse, void>({
      query: () => ({
        url: "/user-programs",
        method: "GET",
      }),

      providesTags: ["Programs"],
    }),
  }),
});

export const { useGetProgramsQuery } = getProgramsApi;
