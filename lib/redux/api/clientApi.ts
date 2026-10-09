import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  Client,
  ClientListParams,
  ClientListResponseData,
  UpdateClientStatusPayload,
} from "@/types/client.types";

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<
      ApiResponse<ClientListResponseData | Client[]>,
      ClientListParams | void
    >({
      query: (params) => ({
        url: "/admin/clients",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Client" as const, id: "LIST" },
              ...((Array.isArray(result.data)
                ? result.data
                : result.data?.clients || result.data?.data || []
              ).map((client) => ({
                type: "Client" as const,
                id: client.id,
              }))),
            ]
          : [{ type: "Client" as const, id: "LIST" }],
    }),

    getClientById: builder.query<ApiResponse<Client>, string>({
      query: (id) => ({
        url: `/admin/clients/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Client" as const, id }],
    }),

    updateClientStatus: builder.mutation<ApiResponse<Client>, UpdateClientStatusPayload>({
      query: ({ id, ...body }) => ({
        url: `/admin/clients/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Client" as const, id },
        { type: "Client" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useUpdateClientStatusMutation,
} = clientApi;
