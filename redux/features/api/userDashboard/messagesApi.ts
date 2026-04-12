import { baseApi } from "../baseApi";

export interface User {
  id: number;
  name: string;
  email: string;
  image_url: string | null;
  user_type: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  sender: User;
  receiver: User;
}

export interface SendMessagePayload {
  receiver_id: number;
  message: string;
}

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Record<string, Message[]>, void>({
      query: () => ({
        url: "/conversations",
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),
    getMessagesByUserId: builder.query<Message[], number>({
      query: (userId) => ({
        url: `/messages/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Messages", id }],
    }),
    sendMessage: builder.mutation<{ success: boolean; data: Message }, SendMessagePayload>({
      query: (body) => ({
        url: "/messages/send",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetConversationsQuery,
  useGetMessagesByUserIdQuery,
  useSendMessageMutation,
} = messagesApi;
