import { baseApi } from "../baseApi";

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<any, void>({
      query: () => "/faqs",
      providesTags: ["FAQ"],
    }),
    getAdminFaqs: builder.query<any, void>({
      query: () => "/admin/faqs",
      providesTags: ["FAQ"],
    }),
    createFaq: builder.mutation<any, { question: string; answer: string; is_active: boolean }>({
      query: (body) => ({
        url: "/faqs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FAQ"],
    }),
    updateFaq: builder.mutation<any, { id: number; question: string; answer: string; is_active: boolean }>({
      query: ({ id, ...body }) => ({
        url: `/faqs`,
        method: "POST", // The user provided body has //id: 1 //for update, but didn't specify a PUT route. 
        // Re-reading user request: "create api route { question, answer, is_active } this is body... id: 1 for update"
        // Usually, if id is provided in body for POST /faqs, it might handle update. 
        // Let's assume POST /faqs with id in body or check if there's a specialized update route.
        // User request snippet: {{live}}/faqs create api route { //"id": 1, //for update, "question": ... }
        // Wait, the user said "create api route" and gave a body with an optional ID for update.
        // I will use POST /faqs and include the ID if it's an update.
        body: { id, ...body },
      }),
      invalidatesTags: ["FAQ"],
    }),
    deleteFaq: builder.mutation<any, number>({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQ"],
    }),
    toggleFaqStatus: builder.mutation<any, number>({
      query: (id) => ({
        url: `/faqs/status/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["FAQ"],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useGetAdminFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useToggleFaqStatusMutation,
} = faqApi;
