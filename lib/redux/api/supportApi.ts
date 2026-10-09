import { baseApi } from "./baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  SupportTicketItem,
  SupportTicketDetails,
  SupportTicketListParams,
  SupportTicketListResponseData,
  SupportTicketStatsResponseData,
  UpdateSupportTicketStatusPayload,
  AssignSupportTicketPayload,
  AddSupportTicketMessagePayload,
} from "@/types/support.types";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportTickets: builder.query<
      SupportTicketListResponseData,
      SupportTicketListParams | void
    >({
      query: (params) => ({
        url: "/admin/support-tickets",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (
        response:
          | ApiResponse<SupportTicketListResponseData>
          | SupportTicketListResponseData
      ): SupportTicketListResponseData => {
        if ("data" in response && response.data) {
          const inner = response.data;
          if (Array.isArray(inner)) {
            return {
              tickets: inner,
              total: inner.length,
              limit: inner.length,
              offset: 0,
            };
          }
          return inner as SupportTicketListResponseData;
        }
        if (Array.isArray(response)) {
          return {
            tickets: response,
            total: response.length,
            limit: response.length,
            offset: 0,
          };
        }
        return response as SupportTicketListResponseData;
      },
      providesTags: (result) =>
        result?.tickets || result?.data
          ? [
              ...(
                (result.tickets || result.data || []) as SupportTicketItem[]
              ).map(({ id }) => ({ type: "Support" as const, id })),
              { type: "Support", id: "LIST" },
            ]
          : [{ type: "Support", id: "LIST" }],
    }),

    getSupportTicketById: builder.query<SupportTicketDetails, string>({
      query: (ticketId) => ({
        url: `/admin/support-tickets/${ticketId}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<SupportTicketDetails> | SupportTicketDetails
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as SupportTicketDetails;
      },
      providesTags: (_result, _error, id) => [{ type: "Support", id }],
    }),

    getSupportTicketStats: builder.query<SupportTicketStatsResponseData, void>({
      query: () => ({
        url: "/admin/support-tickets/stats/summary",
        method: "GET",
      }),
      transformResponse: (
        response:
          | ApiResponse<SupportTicketStatsResponseData>
          | SupportTicketStatsResponseData
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as SupportTicketStatsResponseData;
      },
      providesTags: [{ type: "Support", id: "STATS" }],
    }),

    updateSupportTicketStatus: builder.mutation<
      ApiResponse<unknown>,
      UpdateSupportTicketStatusPayload
    >({
      query: ({ ticketId, ...body }) => ({
        url: `/admin/support-tickets/${ticketId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "Support", id: ticketId },
        { type: "Support", id: "LIST" },
        { type: "Support", id: "STATS" },
        { type: "Dispute", id: ticketId },
        { type: "Dispute", id: "LIST" },
      ],
    }),

    assignSupportTicketAdmin: builder.mutation<
      ApiResponse<unknown>,
      AssignSupportTicketPayload
    >({
      query: ({ ticketId, adminId }) => ({
        url: `/admin/support-tickets/${ticketId}/assign`,
        method: "POST",
        body: { adminId },
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "Support", id: ticketId },
        { type: "Support", id: "LIST" },
        { type: "Dispute", id: ticketId },
        { type: "Dispute", id: "LIST" },
      ],
    }),

    addSupportTicketMessage: builder.mutation<
      ApiResponse<unknown>,
      AddSupportTicketMessagePayload
    >({
      query: ({ ticketId, ...body }) => ({
        url: `/admin/support-tickets/${ticketId}/messages`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "Support", id: ticketId },
      ],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useGetSupportTicketStatsQuery,
  useUpdateSupportTicketStatusMutation,
  useAssignSupportTicketAdminMutation,
  useAddSupportTicketMessageMutation,
} = supportApi;
