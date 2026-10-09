import { baseApi } from "./baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  DisputeItem,
  DisputeDetails,
  DisputeListParams,
  DisputeListResponseData,
  DisputeStatsResponseData,
  UpdateDisputeStatusPayload,
  AssignDisputePayload,
  AddDisputeMessagePayload,
} from "@/types/dispute.types";

export const disputeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisputes: builder.query<DisputeListResponseData, DisputeListParams | void>({
      query: (params) => ({
        url: "/admin/disputes",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (
        response: ApiResponse<DisputeListResponseData> | DisputeListResponseData
      ): DisputeListResponseData => {
        if ("data" in response && response.data) {
          const inner = response.data;
          if (Array.isArray(inner)) {
            return {
              disputes: inner,
              total: inner.length,
              limit: inner.length,
              offset: 0,
            };
          }
          return inner as DisputeListResponseData;
        }
        if (Array.isArray(response)) {
          return {
            disputes: response,
            total: response.length,
            limit: response.length,
            offset: 0,
          };
        }
        return response as DisputeListResponseData;
      },
      providesTags: (result) =>
        result?.disputes || result?.tickets || result?.data
          ? [
              ...(
                (result.disputes || result.tickets || result.data || []) as DisputeItem[]
              ).map(({ id }) => ({ type: "Dispute" as const, id })),
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
        { type: "Dispute", id: "STATS" },
      ],
    }),

    assignDisputeAdmin: builder.mutation<
      ApiResponse<unknown>,
      AssignDisputePayload
    >({
      query: ({ ticketId, adminId }) => ({
        url: `/admin/support-tickets/${ticketId}/assign`,
        method: "POST",
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
          | ApiResponse<{ admins?: Array<{ id: string; fullName: string; email: string }>; data?: Array<{ id: string; fullName: string; email: string }> }>
          | { admins?: Array<{ id: string; fullName: string; email: string }>; data?: Array<{ id: string; fullName: string; email: string }> }
      ) => {
        const payload = "data" in response && response.data ? response.data : response;
        if (Array.isArray(payload)) return payload;
        if ("admins" in payload && Array.isArray(payload.admins)) return payload.admins;
        if ("data" in payload && Array.isArray(payload.data)) return payload.data;
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
