import { baseApi, getBaseUrl } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import Cookies from "js-cookie";
import {
  AnalyticsQueryParams,
  AnalyticsOverviewData,
  RevenueTrendResponseData,
  RevenueByCategoryResponseData,
  JobTrendResponseData,
  UserGrowthResponseData,
  PopularCategoriesResponseData,
  DisputeRateData,
  VerificationRequestsData,
  FullAnalyticsDashboardData,
  CategoryRevenueItem,
  RevenueTrendItem,
  JobTrendItem,
  UserGrowthItem,
  PopularCategoryItem,
} from "@/types/analytics.types";

function cleanParams(params?: AnalyticsQueryParams) {
  if (!params) return undefined;
  const cleaned: Record<string, any> = {};
  if (params.timeframe) cleaned.timeframe = params.timeframe;
  if (params.startDate) cleaned.startDate = params.startDate;
  if (params.endDate) cleaned.endDate = params.endDate;
  if (typeof params.limit === "number") cleaned.limit = params.limit;
  if (params.format) cleaned.format = params.format;
  return cleaned;
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsOverview: builder.query<
      AnalyticsOverviewData,
      AnalyticsQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/insights/analytics/overview",
        method: "GET",
        params: cleanParams(params || undefined),
      }),
      transformResponse: (
        response: ApiResponse<AnalyticsOverviewData> | AnalyticsOverviewData
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as AnalyticsOverviewData;
      },
      providesTags: [{ type: "Analytics", id: "OVERVIEW" }],
    }),

    getRevenueTrend: builder.query<
      RevenueTrendItem[] | RevenueTrendResponseData,
      AnalyticsQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/insights/analytics/revenue-trend",
        method: "GET",
        params: cleanParams(params || undefined),
      }),
      transformResponse: (
        response:
          | ApiResponse<RevenueTrendResponseData | RevenueTrendItem[]>
          | RevenueTrendResponseData
          | RevenueTrendItem[]
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as RevenueTrendItem[] | RevenueTrendResponseData;
      },
      providesTags: [{ type: "Analytics", id: "REVENUE_TREND" }],
    }),

    getRevenueByCategory: builder.query<
      CategoryRevenueItem[] | RevenueByCategoryResponseData,
      AnalyticsQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/insights/analytics/revenue-by-category",
        method: "GET",
        params: cleanParams(params || undefined),
      }),
      transformResponse: (
        response:
          | ApiResponse<RevenueByCategoryResponseData | CategoryRevenueItem[]>
          | RevenueByCategoryResponseData
          | CategoryRevenueItem[]
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as
          | CategoryRevenueItem[]
          | RevenueByCategoryResponseData;
      },
      providesTags: [{ type: "Analytics", id: "REVENUE_BY_CATEGORY" }],
    }),

    getJobTrend: builder.query<
      JobTrendItem[] | JobTrendResponseData,
      AnalyticsQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/insights/analytics/job-trend",
        method: "GET",
        params: cleanParams(params || undefined),
      }),
      transformResponse: (
        response:
          | ApiResponse<JobTrendResponseData | JobTrendItem[]>
          | JobTrendResponseData
          | JobTrendItem[]
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as JobTrendItem[] | JobTrendResponseData;
      },
      providesTags: [{ type: "Analytics", id: "JOB_TREND" }],
    }),

    getUserGrowth: builder.query<
      UserGrowthItem[] | UserGrowthResponseData,
      AnalyticsQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/insights/analytics/user-growth",
        method: "GET",
        params: cleanParams(params || undefined),
      }),
      transformResponse: (
        response:
          | ApiResponse<UserGrowthResponseData | UserGrowthItem[]>
          | UserGrowthResponseData
          | UserGrowthItem[]
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as UserGrowthItem[] | UserGrowthResponseData;
      },
      providesTags: [{ type: "Analytics", id: "USER_GROWTH" }],
    }),

    getPopularCategories: builder.query<
      PopularCategoryItem[] | PopularCategoriesResponseData,
      AnalyticsQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/insights/analytics/popular-categories",
        method: "GET",
        params: cleanParams(params || undefined),
      }),
      transformResponse: (
        response:
          | ApiResponse<PopularCategoriesResponseData | PopularCategoryItem[]>
          | PopularCategoriesResponseData
          | PopularCategoryItem[]
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as
          | PopularCategoryItem[]
          | PopularCategoriesResponseData;
      },
      providesTags: [{ type: "Analytics", id: "POPULAR_CATEGORIES" }],
    }),

    getDisputeRate: builder.query<
      DisputeRateData,
      AnalyticsQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/insights/analytics/dispute-rate",
        method: "GET",
        params: cleanParams(params || undefined),
      }),
      transformResponse: (
        response: ApiResponse<DisputeRateData> | DisputeRateData
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as DisputeRateData;
      },
      providesTags: [{ type: "Analytics", id: "DISPUTE_RATE" }],
    }),

    getVerificationRequests: builder.query<
      VerificationRequestsData,
      AnalyticsQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/insights/analytics/verification-requests",
        method: "GET",
        params: cleanParams(params || undefined),
      }),
      transformResponse: (
        response: ApiResponse<VerificationRequestsData> | VerificationRequestsData
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as VerificationRequestsData;
      },
      providesTags: [{ type: "Analytics", id: "VERIFICATION_REQUESTS" }],
    }),

    getFullDashboard: builder.query<
      FullAnalyticsDashboardData,
      AnalyticsQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/insights/analytics/dashboard",
        method: "GET",
        params: cleanParams(params || undefined),
      }),
      transformResponse: (
        response: ApiResponse<FullAnalyticsDashboardData> | FullAnalyticsDashboardData
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as FullAnalyticsDashboardData;
      },
      providesTags: [{ type: "Analytics", id: "DASHBOARD" }],
    }),
  }),
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetRevenueTrendQuery,
  useGetRevenueByCategoryQuery,
  useGetJobTrendQuery,
  useGetUserGrowthQuery,
  useGetPopularCategoriesQuery,
  useGetDisputeRateQuery,
  useGetVerificationRequestsQuery,
  useGetFullDashboardQuery,
} = analyticsApi;

/**
 * Downloads analytics report file directly from backend with current auth token
 */
export async function downloadAnalyticsReport(params: AnalyticsQueryParams = {}) {
  const token = Cookies.get("mayogo_auth_session");
  const baseUrl = getBaseUrl();
  const search = new URLSearchParams();
  if (params.timeframe) search.set("timeframe", params.timeframe);
  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  search.set("format", params.format || "csv");

  const url = `${baseUrl}/admin/insights/analytics/export?${search.toString()}`;
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let errMsg = response.statusText;
    try {
      const errJson = await response.json();
      errMsg = errJson.message || errJson.error || errMsg;
    } catch {
      // ignore json parse error
    }
    throw new Error(`Failed to export report: ${errMsg}`);
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  const ext = params.format === "json" ? "json" : "csv";
  const timeframePart = params.timeframe || "last_30_days";
  a.download = `analytics-report-${timeframePart}-${new Date().toISOString().slice(0, 10)}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
}
