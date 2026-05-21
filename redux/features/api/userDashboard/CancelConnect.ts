import { baseApi } from "../baseApi";

interface CancelConnectedUserPayload {
  user_id: number;
}

interface CancelConnectedUserResponse {
  success: boolean;
  message: string;
}

export const connectedUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    cancelConnectedUser: builder.mutation<
      CancelConnectedUserResponse,
      CancelConnectedUserPayload
    >({
      query: (body) => ({
        url: "/cancel-connected-user",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Clients", "Projection"],
    }),
  }),
});

export const { useCancelConnectedUserMutation } = connectedUserApi;
