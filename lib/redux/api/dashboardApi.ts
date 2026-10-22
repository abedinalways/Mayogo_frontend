import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  KpiCardsResponseData,
  MonthlyEarningsQueryParams,
  MonthlyEarningsItem,
  DashboardTopCategoryItem,
  DashboardRecentJobItem,
  DashboardRecentActivityItem,
  DashboardTopExpertItem,
  DashboardSearchQueryParams,
  DashboardSearchResponseData,
} from "@/types/dashboard.types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getKpiCards: builder.query<KpiCardsResponseData, void>({
      query: () => ({
        url: "/admin/dashboard/kpi-cards",
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<KpiCardsResponseData> | KpiCardsResponseData
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as KpiCardsResponseData;
      },
      providesTags: [{ type: "Dashboard", id: "KPI_CARDS" }],
    }),

    getMonthlyEarnings: builder.query<
      MonthlyEarningsItem[],
      MonthlyEarningsQueryParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params?.timeframe) {
          queryParams.timeframe = params.timeframe;
        }
        return {
          url: "/admin/dashboard/monthly-earnings",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (
        response:
          | ApiResponse<MonthlyEarningsItem[] | { earnings?: MonthlyEarningsItem[]; items?: MonthlyEarningsItem[]; data?: MonthlyEarningsItem[] }>
          | MonthlyEarningsItem[]
          | { earnings?: MonthlyEarningsItem[]; items?: MonthlyEarningsItem[]; data?: MonthlyEarningsItem[] }
      ) => {
        const raw =
          response && "data" in response && response.data
            ? response.data
            : response;

        if (Array.isArray(raw)) {
          return raw;
        }
        if (raw && typeof raw === "object") {
          if (Array.isArray((raw as any).earnings)) return (raw as any).earnings;
          if (Array.isArray((raw as any).items)) return (raw as any).items;
          if (Array.isArray((raw as any).data)) return (raw as any).data;
        }
        return [];
      },
      providesTags: [{ type: "Dashboard", id: "MONTHLY_EARNINGS" }],
    }),

    getTopCategories: builder.query<DashboardTopCategoryItem[], void>({
      query: () => ({
        url: "/admin/dashboard/top-categories",
        method: "GET",
      }),
      transformResponse: (
        response:
          | ApiResponse<
              | DashboardTopCategoryItem[]
              | { categories?: DashboardTopCategoryItem[]; items?: DashboardTopCategoryItem[]; data?: DashboardTopCategoryItem[] }
            >
          | DashboardTopCategoryItem[]
          | { categories?: DashboardTopCategoryItem[]; items?: DashboardTopCategoryItem[]; data?: DashboardTopCategoryItem[] }
      ) => {
        const raw =
          response && "data" in response && response.data
            ? response.data
            : response;

        if (Array.isArray(raw)) {
          return raw;
        }
        if (raw && typeof raw === "object") {
          if (Array.isArray((raw as any).categories)) return (raw as any).categories;
          if (Array.isArray((raw as any).items)) return (raw as any).items;
          if (Array.isArray((raw as any).data)) return (raw as any).data;
        }
        return [];
      },
      providesTags: [{ type: "Dashboard", id: "TOP_CATEGORIES" }],
    }),

    getRecentJobs: builder.query<
      DashboardRecentJobItem[],
      { limit?: number } | void
    >({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params?.limit) {
          queryParams.limit = params.limit;
        }
        return {
          url: "/admin/dashboard/recent-jobs",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (
        response:
          | ApiResponse<
              | DashboardRecentJobItem[]
              | { jobs?: DashboardRecentJobItem[]; items?: DashboardRecentJobItem[]; data?: DashboardRecentJobItem[] }
            >
          | DashboardRecentJobItem[]
          | { jobs?: DashboardRecentJobItem[]; items?: DashboardRecentJobItem[]; data?: DashboardRecentJobItem[] }
      ) => {
        const raw =
          response && "data" in response && response.data
            ? response.data
            : response;

        if (Array.isArray(raw)) {
          return raw;
        }
        if (raw && typeof raw === "object") {
          if (Array.isArray((raw as any).jobs)) return (raw as any).jobs;
          if (Array.isArray((raw as any).items)) return (raw as any).items;
          if (Array.isArray((raw as any).data)) return (raw as any).data;
        }
        return [];
      },
      providesTags: [
        { type: "Dashboard", id: "RECENT_JOBS" },
        { type: "Job", id: "LIST" },
      ],
    }),

    getRecentActivity: builder.query<
      DashboardRecentActivityItem[],
      { limit?: number } | void
    >({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params?.limit) {
          queryParams.limit = params.limit;
        }
        return {
          url: "/admin/dashboard/recent-activity",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (
        response:
          | ApiResponse<
              | DashboardRecentActivityItem[]
              | { activities?: DashboardRecentActivityItem[]; items?: DashboardRecentActivityItem[]; data?: DashboardRecentActivityItem[] }
            >
          | DashboardRecentActivityItem[]
          | { activities?: DashboardRecentActivityItem[]; items?: DashboardRecentActivityItem[]; data?: DashboardRecentActivityItem[] }
      ) => {
        const raw =
          response && "data" in response && response.data
            ? response.data
            : response;

        if (Array.isArray(raw)) {
          return raw;
        }
        if (raw && typeof raw === "object") {
          if (Array.isArray((raw as any).activities)) return (raw as any).activities;
          if (Array.isArray((raw as any).items)) return (raw as any).items;
          if (Array.isArray((raw as any).data)) return (raw as any).data;
        }
        return [];
      },
      providesTags: [{ type: "Dashboard", id: "RECENT_ACTIVITY" }],
    }),

    getTopExperts: builder.query<
      DashboardTopExpertItem[],
      { limit?: number } | void
    >({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params?.limit) {
          queryParams.limit = params.limit;
        }
        return {
          url: "/admin/dashboard/top-experts",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (
        response:
          | ApiResponse<
              | DashboardTopExpertItem[]
              | { experts?: DashboardTopExpertItem[]; items?: DashboardTopExpertItem[]; data?: DashboardTopExpertItem[] }
            >
          | DashboardTopExpertItem[]
          | { experts?: DashboardTopExpertItem[]; items?: DashboardTopExpertItem[]; data?: DashboardTopExpertItem[] }
      ) => {
        const raw =
          response && "data" in response && response.data
            ? response.data
            : response;

        if (Array.isArray(raw)) {
          return raw;
        }
        if (raw && typeof raw === "object") {
          if (Array.isArray((raw as any).experts)) return (raw as any).experts;
          if (Array.isArray((raw as any).items)) return (raw as any).items;
          if (Array.isArray((raw as any).data)) return (raw as any).data;
        }
        return [];
      },
      providesTags: [
        { type: "Dashboard", id: "TOP_EXPERTS" },
        { type: "Expert", id: "LIST" },
      ],
    }),

    getDashboardSearch: builder.query<
      DashboardSearchResponseData,
      DashboardSearchQueryParams
    >({
      query: (params) => {
        const queryParams: Record<string, any> = { q: params.q };
        if (params.type) queryParams.type = params.type;
        if (params.limit) queryParams.limit = params.limit;
        return {
          url: "/admin/dashboard/search",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (
        response:
          | ApiResponse<DashboardSearchResponseData>
          | DashboardSearchResponseData
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return (response as DashboardSearchResponseData) || {};
      },
      providesTags: [{ type: "Dashboard", id: "SEARCH" }],
    }),
  }),
});

export const {
  useGetKpiCardsQuery,
  useGetMonthlyEarningsQuery,
  useGetTopCategoriesQuery,
  useGetRecentJobsQuery,
  useGetRecentActivityQuery,
  useGetTopExpertsQuery,
  useGetDashboardSearchQuery,
  useLazyGetDashboardSearchQuery,
} = dashboardApi;
