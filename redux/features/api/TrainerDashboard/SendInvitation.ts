import { baseApi } from "../baseApi";


export const invitationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendInvitation: builder.mutation<
      { success: boolean; message: string },
      { email: string; match_reason?: string; recommended_actions?: string[] }
    >({
      query: (data) => ({
        url: "/invitations/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invitation"],
    }),
  }),
});

export const { useSendInvitationMutation } = invitationApi;
