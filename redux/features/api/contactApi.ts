import { baseApi } from "./baseApi";

export interface ContactRequest {
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<ContactResponse, ContactRequest>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSendMessageMutation } = contactApi;

export default contactApi;
