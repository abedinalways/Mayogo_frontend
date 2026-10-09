export interface AdminRoleInfo {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  isSystem?: boolean;
  isActive?: boolean;
}

export interface AdminUserItem {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  avatarUrl?: string;
  roleId?: string;
  role?: AdminRoleInfo | string;
  roleName?: string;
  isActive: boolean;
  isSuperAdmin?: boolean;
  mustResetPassword?: boolean;
  lastActivityAt?: string;
  lastActivity?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminListParams {
  search?: string;
  isActive?: boolean;
  roleId?: string;
  isSuperAdmin?: boolean;
  sortBy?: "createdAt" | "fullName" | "lastActivityAt";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface AdminListResponseData {
  admins?: AdminUserItem[];
  data?: AdminUserItem[];
  items?: AdminUserItem[];
  total: number;
  limit: number;
  offset: number;
  page?: number;
  totalPages?: number;
}

export interface CreateAdminPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  roleId: string;
  mustResetPassword?: boolean;
  isActive?: boolean;
  avatar?: File | string | null;
}

export interface UpdateAdminPayload {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  roleId?: string;
  mustResetPassword?: boolean;
  isActive?: boolean;
  avatar?: File | string | null;
}

export interface AssignAdminRolePayload {
  id: string;
  roleId: string;
}
