import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  AdminUserItem,
  AdminListParams,
  AdminListResponseData,
  AssignAdminRolePayload,
  AdminRoleInfo,
} from "@/types/admin.types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<AdminListResponseData, AdminListParams | void>({
      query: (params) => ({
        url: "/admin/admins",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (
        response: ApiResponse<AdminListResponseData> | AdminListResponseData
      ): AdminListResponseData => {
        if ("data" in response && response.data) {
          const inner = response.data;
          if (Array.isArray(inner)) {
            return {
              admins: inner,
              total: inner.length,
              limit: inner.length,
              offset: 0,
            };
          }
          return inner as AdminListResponseData;
        }
        if (Array.isArray(response)) {
          return {
            admins: response,
            total: response.length,
            limit: response.length,
            offset: 0,
          };
        }
        return response as AdminListResponseData;
      },
      providesTags: (result) =>
        result
          ? [
              { type: "Admin" as const, id: "LIST" },
              ...(result.admins || result.data || result.items || []).map(
                (item) => ({
                  type: "Admin" as const,
                  id: item.id,
                })
              ),
            ]
          : [{ type: "Admin" as const, id: "LIST" }],
    }),

    getAdminById: builder.query<AdminUserItem, string>({
      query: (id) => ({
        url: `/admin/admins/${id}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<AdminUserItem> | AdminUserItem
      ): AdminUserItem => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as AdminUserItem;
      },
      providesTags: (_result, _error, id) => [{ type: "Admin" as const, id }],
    }),

    createAdmin: builder.mutation<AdminUserItem, FormData>({
      query: (formData) => ({
        url: "/admin/admins",
        method: "POST",
        body: formData,
      }),
      transformResponse: (
        response: ApiResponse<AdminUserItem> | AdminUserItem
      ): AdminUserItem => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as AdminUserItem;
      },
      invalidatesTags: [{ type: "Admin" as const, id: "LIST" }],
    }),

    updateAdmin: builder.mutation<
      AdminUserItem,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/admins/${id}`,
        method: "PATCH",
        body: formData,
      }),
      transformResponse: (
        response: ApiResponse<AdminUserItem> | AdminUserItem
      ): AdminUserItem => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as AdminUserItem;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Admin" as const, id: "LIST" },
        { type: "Admin" as const, id },
      ],
    }),

    deleteAdmin: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/admin/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Admin" as const, id: "LIST" }],
    }),

    assignAdminRole: builder.mutation<unknown, AssignAdminRolePayload>({
      query: ({ id, roleId }) => ({
        url: `/admin/admins/${id}/role`,
        method: "PATCH",
        body: { roleId },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Admin" as const, id: "LIST" },
        { type: "Admin" as const, id },
      ],
    }),

    getRoles: builder.query<
      AdminRoleInfo[],
      { search?: string; isActive?: boolean } | void
    >({
      query: (params) => ({
        url: "/admin/roles",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (
        response:
          | ApiResponse<AdminRoleInfo[] | { roles?: AdminRoleInfo[]; data?: AdminRoleInfo[] }>
          | AdminRoleInfo[]
          | { roles?: AdminRoleInfo[]; data?: AdminRoleInfo[] }
      ): AdminRoleInfo[] => {
        const payload =
          "data" in response && response.data ? response.data : response;
        if (Array.isArray(payload)) {
          return payload as AdminRoleInfo[];
        }
        if (typeof payload === "object" && payload !== null) {
          const obj = payload as { roles?: AdminRoleInfo[]; data?: AdminRoleInfo[] };
          return obj.roles || obj.data || [];
        }
        return [];
      },
      providesTags: [{ type: "Role" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useAssignAdminRoleMutation,
  useGetRolesQuery,
} = adminApi;
