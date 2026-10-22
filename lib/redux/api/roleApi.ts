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

/**
 * Recursively extracts a flat list of PermissionItem objects from any backend response shape:
 * - Flat array: [ { id, key, module, submodule, action } ]
 * - Grouped by module: { "Core Operations": [ { id, ... } ], ... }
 * - Array of module groups: [ { module: "...", permissions: [ ... ] } ]
 * - Wrapped object: { data: { roleId: "...", permissions: [ ... ] } }
 */
export function extractAllPermissions(input: unknown): PermissionItem[] {
  if (!input) return [];
  const results: PermissionItem[] = [];
  const seenIds = new Set<string>();

  function traverse(node: unknown) {
    if (!node) return;

    if (Array.isArray(node)) {
      for (const item of node) {
        traverse(item);
      }
      return;
    }

    if (typeof node === "string") {
      const trimmed = node.trim();
      if (trimmed.length > 5 && !seenIds.has(trimmed)) {
        seenIds.add(trimmed);
        results.push({
          id: trimmed,
          key: trimmed,
          module: "",
          submodule: "",
          action: "",
        });
      }
      return;
    }

    if (typeof node === "object" && node !== null) {
      const obj = node as Record<string, unknown>;

      const id = String(obj.id || obj.permissionId || obj._id || "");
      // Check if this object is itself a PermissionItem
      if (id && (obj.action || obj.key || obj.module || obj.submodule)) {
        if (!seenIds.has(id)) {
          seenIds.add(id);
          results.push({
            id: id,
            key: typeof obj.key === "string" ? obj.key : "",
            module: typeof obj.module === "string" ? obj.module : "",
            submodule: typeof obj.submodule === "string" ? obj.submodule : "",
            action: typeof obj.action === "string" ? obj.action : "",
            description: typeof obj.description === "string" ? obj.description : undefined,
          });
        }
      }

      // Recursively traverse ALL properties
      for (const key of Object.keys(obj)) {
        if (
          key !== "success" &&
          key !== "statusCode" &&
          key !== "message" &&
          key !== "timestamp" &&
          key !== "path" &&
          key !== "roleId" &&
          key !== "roleName" &&
          key !== "total"
        ) {
          const val = obj[key];
          if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
            traverse(val);
          }
        }
      }
    }
  }

  traverse(input);
  return results;
}

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
        params: {
          limit: 100,
          ...(params || {}),
        },
      }),
      transformResponse: (response: unknown): PermissionItem[] => {
        return extractAllPermissions(response);
      },
      providesTags: [{ type: "Role" as const, id: "PERMISSIONS" }],
    }),

    getRolePermissions: builder.query<PermissionItem[], string>({
      query: (roleId) => ({
        url: `/admin/roles/${roleId}/permissions`,
        method: "GET",
      }),
      transformResponse: (response: unknown): PermissionItem[] => {
        return extractAllPermissions(response);
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
        "Auth",
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
