import { baseApi } from "./baseApi";

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: any;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUpdateProfile: builder.mutation<ProfileResponse, FormData>({
      query: (formData) => ({
        url: "/profile",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    getProfile: builder.query<ProfileResponse, string | number>({
      query: (id) => `/profile/${id}`,
      providesTags: ["Profile"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateUpdateProfileMutation, useGetProfileQuery } = profileApi;

export default profileApi;
