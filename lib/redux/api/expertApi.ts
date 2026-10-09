import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  Expert,
  ExpertListParams,
  ExpertListResponseData,
  UpdateExpertStatusPayload,
  ReviewVerificationPayload,
  VerificationRequestItem,
  VerificationDecisionPayload,
} from "@/types/expert.types";

export const expertApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExperts: builder.query<
      ApiResponse<ExpertListResponseData | Expert[]>,
      ExpertListParams | void
    >({
      query: (params) => ({
        url: "/admin/experts",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Expert" as const, id: "LIST" },
              ...((Array.isArray(result.data)
                ? result.data
                : result.data?.experts || result.data?.data || []
              ).map((expert) => ({
                type: "Expert" as const,
                id: expert.id,
              }))),
            ]
          : [{ type: "Expert" as const, id: "LIST" }],
    }),

    getExpertById: builder.query<ApiResponse<Expert>, string>({
      query: (id) => ({
        url: `/admin/experts/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Expert" as const, id }],
    }),

    getExpertVerification: builder.query<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/admin/experts/${id}/verification`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Verification" as const, id },
      ],
    }),

    updateExpertStatus: builder.mutation<
      ApiResponse<Expert>,
      UpdateExpertStatusPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/experts/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Expert" as const, id },
        { type: "Expert" as const, id: "LIST" },
      ],
    }),

    reviewExpertVerification: builder.mutation<
      ApiResponse<unknown>,
      ReviewVerificationPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/experts/${id}/verification/review`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Expert" as const, id },
        { type: "Expert" as const, id: "LIST" },
        { type: "Verification" as const, id },
        { type: "Verification" as const, id: "LIST" },
      ],
    }),

    getVerificationRequests: builder.query<
      ApiResponse<{ requests?: VerificationRequestItem[]; items?: VerificationRequestItem[]; total: number } | VerificationRequestItem[]>,
      { search?: string; status?: string; limit?: number; offset?: number } | void
    >({
      query: (params) => ({
        url: "/admin/verification-requests",
        method: "GET",
        params: params || {},
      }),
      providesTags: [{ type: "Verification" as const, id: "LIST" }],
    }),

    makeVerificationDecision: builder.mutation<
      ApiResponse<unknown>,
      VerificationDecisionPayload
    >({
      query: ({ expertId, ...body }) => ({
        url: `/admin/verification-requests/${expertId}/decision`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { expertId }) => [
        { type: "Expert" as const, id: expertId },
        { type: "Expert" as const, id: "LIST" },
        { type: "Verification" as const, id: expertId },
        { type: "Verification" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetExpertsQuery,
  useGetExpertByIdQuery,
  useGetExpertVerificationQuery,
  useUpdateExpertStatusMutation,
  useReviewExpertVerificationMutation,
  useGetVerificationRequestsQuery,
  useMakeVerificationDecisionMutation,
} = expertApi;
