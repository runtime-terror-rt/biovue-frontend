import { baseApi } from "../baseApi";

export interface TrainerProfile {
  user_id: number;
  image: string | null;
}

export interface Trainer {
  id: number;
  name: string;
  profile: TrainerProfile | null;
}

export interface Schedule {
  id: number;
  trainer_id: number;
  client_id: number;
  schedule_date: string;
  schedule_time: string;
  check_in_type: string;
  status: "scheduled" | "completed" | "missed" | string;
  created_at: string;
  updated_at: string;
  trainer: Trainer;
}

export interface GetMySchedulesResponse {
  success: boolean;
  total: number;
  data: Schedule[];
}

export const mySchedulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMySchedules: builder.query<GetMySchedulesResponse, void>({
      query: () => ({
        url: "/my-schedules",
        method: "GET",
      }),

      providesTags: ["Schedule"],
    }),
  }),

  overrideExisting: false,
});

export const { useGetMySchedulesQuery } = mySchedulesApi;
