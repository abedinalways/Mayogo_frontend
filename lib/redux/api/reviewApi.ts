import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  AdminReviewItem,
  ReviewQueryParams,
  ReviewsApiResponse,
  ReviewStatsResponseData,
  ModerateReviewPayload,
} from "@/types/review.types";

function cleanParams(params?: ReviewQueryParams) {
  if (!params) return undefined;
  const cleaned: Record<string, any> = {};
  if (params.status && params.status !== "all" && params.status !== "") {
    cleaned.status = params.status;
  }
  if (typeof params.rating === "number" && params.rating > 0) {
    cleaned.rating = params.rating;
  }
  if (params.expertId) cleaned.expertId = params.expertId;
  if (params.clientId) cleaned.clientId = params.clientId;
  if (params.jobId) cleaned.jobId = params.jobId;
  if (params.search?.trim()) cleaned.search = params.search.trim();
  if (typeof params.limit === "number") cleaned.limit = params.limit;
  if (typeof params.offset === "number") cleaned.offset = params.offset;
  return cleaned;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<ReviewsApiResponse, ReviewQueryParams | void>({
      query: (params) => ({
        url: "/admin/reviews",
        method: "GET",
        params: cleanParams(params || undefined),
      }),
      providesTags: (result) =>
        result?.data && Array.isArray(result.data)
          ? [
              { type: "Review" as const, id: "LIST" },
              ...result.data.map((r) => ({ type: "Review" as const, id: r.id })),
            ]
          : [{ type: "Review" as const, id: "LIST" }],
    }),

    getReviewStats: builder.query<ReviewStatsResponseData, void>({
      query: () => ({
        url: "/admin/reviews/stats",
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<ReviewStatsResponseData> | ReviewStatsResponseData
      ): ReviewStatsResponseData => {
        if ("data" in (response as any) && (response as any).data) {
          return (response as any).data;
        }
        return response as ReviewStatsResponseData;
      },
      providesTags: [{ type: "Review", id: "STATS" }],
    }),

    getReviewById: builder.query<AdminReviewItem, string>({
      query: (reviewId) => ({
        url: `/admin/reviews/${reviewId}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<AdminReviewItem> | AdminReviewItem
      ): AdminReviewItem => {
        if ("data" in (response as any) && (response as any).data) {
          return (response as any).data;
        }
        return response as AdminReviewItem;
      },
      providesTags: (_result, _error, id) => [{ type: "Review", id }],
    }),

    moderateReview: builder.mutation<
      ApiResponse<unknown>,
      ModerateReviewPayload
    >({
      query: ({ reviewId, ...body }) => ({
        url: `/admin/reviews/${reviewId}/moderate`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { reviewId }) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: "LIST" },
        { type: "Review", id: "STATS" },
      ],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewStatsQuery,
  useGetReviewByIdQuery,
  useModerateReviewMutation,
} = reviewApi;
