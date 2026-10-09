import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  AdminJobItem,
  JobListParams,
  JobListResponseData,
  JobStatsResponseData,
  JobCategoryOption,
} from "@/types/job.types";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<
      ApiResponse<JobListResponseData | AdminJobItem[]>,
      JobListParams | void
    >({
      query: (params) => ({
        url: "/admin/jobs",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Job" as const, id: "LIST" },
              ...((Array.isArray(result.data)
                ? result.data
                : result.data?.jobs || result.data?.data || []
              ).map((job) => ({
                type: "Job" as const,
                id: job.id,
              }))),
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
