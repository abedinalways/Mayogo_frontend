import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  RoleItem,
  RoleListParams,
  CreateRolePayload,
  UpdateRolePayload,
  AssignRolePermissionsPayload,
  PermissionItem,
} from "@/types/role.types";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RoleItem[], RoleListParams | void>({
      query: (params) => ({
        url: "/admin/roles",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (
        response:
          | ApiResponse<RoleItem[] | { roles?: RoleItem[]; data?: RoleItem[] }>
          | RoleItem[]
          | { roles?: RoleItem[]; data?: RoleItem[] }
      ): RoleItem[] => {
        const payload =
          "data" in response && response.data ? response.data : response;
        if (Array.isArray(payload)) {
          return payload as RoleItem[];
        }
        if (typeof payload === "object" && payload !== null) {
          const obj = payload as { roles?: RoleItem[]; data?: RoleItem[] };
          return obj.roles || obj.data || [];
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              { type: "Role" as const, id: "LIST" },
              ...result.map((role) => ({
                type: "Role" as const,
                id: role.id,
              })),
            ]
          : [{ type: "Role" as const, id: "LIST" }],
    }),

    getRoleById: builder.query<RoleItem, string>({
      query: (roleId) => ({
        url: `/admin/roles/${roleId}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<RoleItem> | RoleItem
      ): RoleItem => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as RoleItem;
      },
      providesTags: (_result, _error, id) => [{ type: "Role" as const, id }],
    }),

    createRole: builder.mutation<RoleItem, CreateRolePayload>({
      query: (body) => ({
        url: "/admin/roles",
        method: "POST",
        body,
      }),
      transformResponse: (
        response: ApiResponse<RoleItem> | RoleItem
      ): RoleItem => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as RoleItem;
      },
      invalidatesTags: [{ type: "Role" as const, id: "LIST" }],
    }),

    updateRole: builder.mutation<RoleItem, UpdateRolePayload>({
      query: ({ roleId, ...body }) => ({
        url: `/admin/roles/${roleId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (
        response: ApiResponse<RoleItem> | RoleItem
      ): RoleItem => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as RoleItem;
      },
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: "Role" as const, id: "LIST" },
        { type: "Role" as const, id: roleId },
      ],
    }),

    deleteRole: builder.mutation<unknown, string>({
      query: (roleId) => ({
        url: `/admin/roles/${roleId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Role" as const, id: "LIST" }],
    }),

    getAllPermissions: builder.query<
      PermissionItem[],
      { search?: string; module?: string; action?: string; limit?: number } | void
    >({
      query: (params) => ({
        url: "/admin/roles/permissions",
        method: "GET",
        params: params || { limit: 100 },
      }),
      transformResponse: (
        response:
          | ApiResponse<
              | PermissionItem[]
              | { permissions?: PermissionItem[]; data?: PermissionItem[]; items?: PermissionItem[] }
            >
          | PermissionItem[]
          | { permissions?: PermissionItem[]; data?: PermissionItem[]; items?: PermissionItem[] }
      ): PermissionItem[] => {
        const payload =
          "data" in response && response.data ? response.data : response;
        if (Array.isArray(payload)) {
          return payload as PermissionItem[];
        }
        if (typeof payload === "object" && payload !== null) {
          const obj = payload as {
            permissions?: PermissionItem[];
            data?: PermissionItem[];
            items?: PermissionItem[];
          };
          return obj.permissions || obj.data || obj.items || [];
        }
        return [];
      },
      providesTags: [{ type: "Role" as const, id: "PERMISSIONS" }],
    }),

    getRolePermissions: builder.query<PermissionItem[], string>({
      query: (roleId) => ({
        url: `/admin/roles/${roleId}/permissions`,
        method: "GET",
      }),
      transformResponse: (
        response:
          | ApiResponse<
              | PermissionItem[]
              | { permissions?: PermissionItem[]; data?: PermissionItem[]; items?: PermissionItem[] }
            >
          | PermissionItem[]
          | { permissions?: PermissionItem[]; data?: PermissionItem[]; items?: PermissionItem[] }
      ): PermissionItem[] => {
        const payload =
          "data" in response && response.data ? response.data : response;
        if (Array.isArray(payload)) {
          return payload as PermissionItem[];
        }
        if (typeof payload === "object" && payload !== null) {
          const obj = payload as {
            permissions?: PermissionItem[];
            data?: PermissionItem[];
            items?: PermissionItem[];
          };
          return obj.permissions || obj.data || obj.items || [];
        }
        return [];
      },
      providesTags: (_res, _err, roleId) => [
        { type: "Role" as const, id: `PERMS_${roleId}` },
      ],
    }),

    assignRolePermissions: builder.mutation<
      unknown,
      AssignRolePermissionsPayload
    >({
      query: ({ roleId, permissionIds }) => ({
        url: `/admin/roles/${roleId}/permissions`,
        method: "POST",
        body: { permissionIds },
      }),
      invalidatesTags: (_res, _err, { roleId }) => [
        { type: "Role" as const, id: `PERMS_${roleId}` },
        { type: "Role" as const, id: roleId },
      ],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetAllPermissionsQuery,
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
} = roleApi;
