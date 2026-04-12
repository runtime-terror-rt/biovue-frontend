import { baseApi } from "./baseApi";

export interface PaymentProcessResponse {
  success: boolean;
  checkout_url: string;
  session_id: string;
  amount: number;
}

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
    getSubscriptionPlans: builder.query<PlansResponse, { billing: string; type: string }>({
      query: ({ billing, type }) => `/plans?billing=${billing}&type=${type}`,
      providesTags: ["Plans"],
    }),
    processPayment: builder.mutation<PaymentProcessResponse, { plan_id: number; billing: string }>({
      query: (body) => ({
        url: "/payment/process",
        method: "POST",
        body,
      }),
    }),
    getPaymentSummary: builder.query<PaymentSummaryResponse, void>({
      query: () => "/payment/show",
    }),
  }),
  overrideExisting: false,
});

export const { useGetSubscriptionPlansQuery, useProcessPaymentMutation, useGetPaymentSummaryQuery } = paymentApi;

export default paymentApi;
