import { baseApi } from "./baseApi";

export interface PaymentProcessResponse {
  success: boolean;
  checkout_url?: string;
  session_id?: string;
  amount?: string | number;
  is_trial?: boolean;
  trial_days?: number;
  target_plan?: string;
  billing_type?: string;
  message?: string;
}
export type RequestPayload = {
  plan_id: number | string;
  billing: string;
  target_plan_id?: number | string;
  is_trial?: boolean | number | string;
  card_info?: {
    number: string;
    expiry: string;
    cvv: string;
    name?: string;
  };
};

export interface CancelSubscriptionResponse {
  success: boolean;
  status?: string;
  can_cancel?: boolean;
  cancel_requested?: boolean;
  access_until?: string;
  message?: string;
}

export interface PaymentSummaryResponse {
  success: boolean;
  status?: string;
  can_cancel?: boolean;
  cancel_requested?: boolean;
  access_until?: string;
  message?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    plan_type?: string;
    plan_name?: string;
    plan_id?: number | null;
    plan_duration?: number | null;
    is_trial?: boolean | number | string;
    target_plan?: string | null;
    target_plan_id?: number | string | null;
    status?: string;
    cancel_requested?: boolean;
    access_until?: string;
  };
  latest_payment?: {
    id: number;
    transaction_id?: string;
    amount: string | number;
    currency?: string;
    status: string;
    plan_id?: number;
    is_trial?: boolean | number | string;
    trial_days?: number;
    target_plan?: string;
    target_plan_id?: number | string | null;
    created_at: string;
    updated_at?: string;
    start_date?: string | null;
    end_date?: string | null;
    trial_ends_at?: string | null;
    stripe_subscription_id?: string | null;
    cancel_requested?: boolean;
    access_until?: string;
    plan?: {
      id: number;
      name: string;
      price: string | number;
      plan_type?: string;
      projection_limit?: number | null;
      member_limit?: number | null;
    };
  };
  payment_history?: Array<{
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
      plan_type?: string;
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
  price: string | number;
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
    processPayment: builder.mutation<
      PaymentProcessResponse,
      RequestPayload | FormData
    >({
      query: (body) => {
        if (body instanceof FormData) {
          return {
            url: "/payment/process",
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body,
          };
        }

        const formData = new FormData();
        formData.append("plan_id", String(body.plan_id));
        formData.append("billing", body.billing);

        if (body.target_plan_id != null) {
          formData.append("target_plan_id", String(body.target_plan_id));
        }

        const isTrial =
          body.is_trial === true ||
          body.is_trial === 1 ||
          body.is_trial === "1" ||
          body.target_plan_id != null;

        if (isTrial) {
          formData.append("is_trial", "1");
        }

        return {
          url: "/payment/process",
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        };
      },
      invalidatesTags: ["PaymentSummary", "Plans", "Profile", "Projection"],
    }),
    getPaymentSummary: builder.query<PaymentSummaryResponse, string | void>({
      query: (sessionId) =>
        sessionId
          ? `/payment/show?session_id=${encodeURIComponent(sessionId)}`
          : "/payment/show",
      providesTags: ["PaymentSummary"],
    }),
    cancelSubscription: builder.mutation<
      CancelSubscriptionResponse,
      void
    >({
      query: () => ({
        url: "/payment/cancel",
        method: "POST",
      }),
      invalidatesTags: ["PaymentSummary", "Plans", "Profile", "Projection"],
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
