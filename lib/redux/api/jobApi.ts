import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  AdminJobItem,
  JobListParams,
  JobMetaPagination,
  JobStatsResponseData,
  JobCategoryOption,
} from "@/types/job.types";

export interface JobsApiResponse extends ApiResponse<AdminJobItem[]> {
  meta?: JobMetaPagination;
}

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<JobsApiResponse, JobListParams | void>({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params) {
          if (params.tab && params.tab !== "ALL") queryParams.tab = params.tab;
          if (params.paymentStatus && params.paymentStatus !== "all") {
            queryParams.paymentStatus = params.paymentStatus;
          }
          if (params.categoryId) queryParams.categoryId = params.categoryId;
          if (params.serviceId) queryParams.serviceId = params.serviceId;
          if (params.expertId) queryParams.expertId = params.expertId;
          if (params.clientId) queryParams.clientId = params.clientId;
          if (params.search?.trim()) queryParams.search = params.search.trim();
          if (params.sortBy) queryParams.sortBy = params.sortBy;
          if (typeof params.limit === "number") queryParams.limit = params.limit;
          if (typeof params.offset === "number") queryParams.offset = params.offset;
        }
        return {
          url: "/admin/jobs",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data && Array.isArray(result.data)
          ? [
              { type: "Job" as const, id: "LIST" },
              ...result.data.map((job) => ({
                type: "Job" as const,
                id: job.id,
              })),
            ]
          : [{ type: "Job" as const, id: "LIST" }],
    }),

    getJobById: builder.query<ApiResponse<AdminJobItem>, string>({
      query: (jobId) => ({
        url: `/admin/jobs/${jobId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Job" as const, id }],
    }),

    getJobStats: builder.query<ApiResponse<JobStatsResponseData>, void>({
      query: () => ({
        url: "/admin/jobs/stats",
        method: "GET",
      }),
      providesTags: [{ type: "Job" as const, id: "STATS" }],
    }),

    getJobCategories: builder.query<ApiResponse<JobCategoryOption[]>, void>({
      query: () => ({
        url: "/admin/jobs/categories",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useGetJobStatsQuery,
  useGetJobCategoriesQuery,
} = jobApi;
