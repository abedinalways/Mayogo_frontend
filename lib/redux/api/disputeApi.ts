import { baseApi } from "./baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  DisputeItem,
  DisputeDetails,
  DisputeListParams,
  DisputeMetaPagination,
  DisputeStatsResponseData,
  UpdateDisputeStatusPayload,
  AssignDisputePayload,
  AddDisputeMessagePayload,
} from "@/types/dispute.types";

export interface DisputesApiResponse extends ApiResponse<DisputeItem[]> {
  meta?: DisputeMetaPagination;
}

export const disputeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisputes: builder.query<DisputesApiResponse, DisputeListParams | void>({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params) {
          if (params.tab && params.tab !== "ALL") queryParams.tab = params.tab;
          if (params.priority && params.priority !== "all") queryParams.priority = params.priority;
          if (params.category && params.category !== "all") queryParams.category = params.category;
          if (params.assignedAdminId) queryParams.assignedAdminId = params.assignedAdminId;
          if (params.jobId) queryParams.jobId = params.jobId;
          if (params.search?.trim()) queryParams.search = params.search.trim();
          if (params.sortBy) queryParams.sortBy = params.sortBy;
          if (typeof params.limit === "number") queryParams.limit = params.limit;
          if (typeof params.offset === "number") queryParams.offset = params.offset;
        }
        return {
          url: "/admin/disputes",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({ type: "Dispute" as const, id })),
              { type: "Dispute", id: "LIST" },
            ]
          : [{ type: "Dispute", id: "LIST" }],
    }),

    getDisputeById: builder.query<DisputeDetails, string>({
      query: (disputeId) => ({
        url: `/admin/disputes/${disputeId}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<DisputeDetails> | DisputeDetails
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as DisputeDetails;
      },
      providesTags: (_result, _error, id) => [{ type: "Dispute", id }],
    }),

    getDisputeStats: builder.query<DisputeStatsResponseData, void>({
      query: () => ({
        url: "/admin/disputes/stats",
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<DisputeStatsResponseData> | DisputeStatsResponseData
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as DisputeStatsResponseData;
      },
      providesTags: [{ type: "Dispute", id: "STATS" }],
    }),

    updateDisputeStatus: builder.mutation<
      ApiResponse<unknown>,
      UpdateDisputeStatusPayload
    >({
      query: ({ ticketId, ...body }) => ({
        url: `/admin/support-tickets/${ticketId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "Dispute", id: ticketId },
        { type: "Dispute", id: "LIST" },
      ],
    }),

    assignDisputeAdmin: builder.mutation<
      ApiResponse<unknown>,
      AssignDisputePayload
    >({
      query: ({ ticketId, adminId }) => ({
        url: `/admin/support-tickets/${ticketId}/assign`,
        method: "PATCH",
        body: { adminId },
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "Dispute", id: ticketId },
        { type: "Dispute", id: "LIST" },
      ],
    }),

    addDisputeMessage: builder.mutation<
      ApiResponse<unknown>,
      AddDisputeMessagePayload
    >({
      query: ({ ticketId, ...body }) => ({
        url: `/admin/support-tickets/${ticketId}/messages`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "Dispute", id: ticketId },
      ],
    }),

    getAdminsList: builder.query<
      Array<{ id: string; fullName: string; email: string }>,
      void
    >({
      query: () => ({
        url: "/admin/admins",
        method: "GET",
        params: { limit: 100, isActive: true },
      }),
      transformResponse: (
        response:
          | ApiResponse<Array<{ id: string; fullName: string; email: string }>>
          | Array<{ id: string; fullName: string; email: string }>
      ) => {
        const payload =
          "data" in response && response.data ? response.data : response;
        if (Array.isArray(payload)) return payload;
        if ("admins" in (payload as any) && Array.isArray((payload as any).admins)) {
          return (payload as any).admins;
        }
        return [];
      },
      providesTags: [{ type: "Admin", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDisputesQuery,
  useGetDisputeByIdQuery,
  useGetDisputeStatsQuery,
  useUpdateDisputeStatusMutation,
  useAssignDisputeAdminMutation,
  useAddDisputeMessageMutation,
  useGetAdminsListQuery,
} = disputeApi;
