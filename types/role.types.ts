export type PermissionAction = "VIEW" | "MANAGE" | "ALLOW_ALL";

export interface PermissionItem {
  id: string;
  key: string;
  module: string;
  submodule: string;
  action: PermissionAction | string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleItem {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  isSystem?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  permissions?: PermissionItem[];
  _count?: {
    admins?: number;
    permissions?: number;
  };
}

export interface RoleListParams {
  search?: string;
  isActive?: boolean;
  isSystem?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRolePayload {
  roleId: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface AssignRolePermissionsPayload {
  roleId: string;
  permissionIds: string[];
}
