import { baseApi } from "../baseApi";

export interface ReportStats {
  total_signups: string;
  total_subscriptions: string;
  total_revenue: string;
  churn_rate: string;
  website_visits: string;
  app_visits: string;
  projections_individual: string;
  projections_professional: string;
}

export interface PlanTableItem {
  name: string;
  plan_type: string;
  active_subscribers: number;
  monthly_revenue: string;
  churn_percentage: string;
}

export interface ChartData {
  subscriptions: number;
  revenue: number;
}

export interface ReportsResponse {
  success: boolean;
  stats: ReportStats;
  plan_table: PlanTableItem[];
  charts: {
    [month: string]: ChartData;
  };
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<ReportsResponse, void>({
      query: () => "/admin/reports",
      providesTags: ["Reports"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetReportsQuery } = reportsApi;

export default reportsApi;
