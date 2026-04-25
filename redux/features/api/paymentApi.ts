import { baseApi } from "./baseApi";

export interface PaymentProcessResponse {
  success: boolean;
  checkout_url: string;
  session_id: string;
  amount: number;
}
export type RequestPayload = {
  plan_id: number;
  billing: string;
  card_info?: {
    number: string;
    expiry: string;
    cvv: string;
    name?: string;
  };
};
export interface PaymentSummaryResponse {
  success: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
  latest_payment: {
    id: number;
    transaction_id: string;
    amount: string;
    currency: string;
    status: string;
    created_at: string;
    updated_at: string;
    plan: {
      id: number;
      name: string;
      price: string;
    };
  };
  payment_history: Array<{
    id: number;
    transaction_id: string;
    amount: string;
    currency: string;
    status: string;
    created_at: string;
    updated_at: string;
    plan: {
      id: number;
      name: string;
      price: string;
    };
  }>;
}

export interface Plan {
  id: number;
  name: string;
  plan_type: string;
  billing_cycle: string;
  duration: number | null;
  member_limit: number | null;
  features: string[];
  status: boolean;
  price: string;
}

export interface PlansResponse {
  success: boolean;
  data: Plan[];
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<
      PlansResponse,
      { billing: string; type: string }
    >({
      query: ({ billing, type }) => `/plans?billing=${billing}&type=${type}`,
      providesTags: ["Plans"],
    }),
    // processPayment: builder.mutation<PaymentProcessResponse, { plan_id: number; billing: string }>({
    processPayment: builder.mutation<PaymentProcessResponse, RequestPayload>({
      query: (body) => ({
        url: "/payment/process",
        method: "POST",
        body,
      }),
    }),
    getPaymentSummary: builder.query<PaymentSummaryResponse, void>({
      query: () => "/payment/show",
      providesTags: ["PaymentSummary"],
    }),
    cancelSubscription: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/payment/cancel",
        method: "POST",
      }),
      invalidatesTags: ["PaymentSummary", "Plans", "Profile"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSubscriptionPlansQuery,
  useProcessPaymentMutation,
  useGetPaymentSummaryQuery,
  useCancelSubscriptionMutation,
} = paymentApi;

export default paymentApi;
