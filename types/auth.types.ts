export interface AdminPermission {
  id?: string;
  name?: string;
  key?: string;
  module?: string;
  submodule?: string;
  action?: string;
  description?: string;
}

export interface AdminGroupedPermission {
  module: string;
  permissions: {
    key: string;
    submodule: string;
    action: string;
    description: string;
  }[];
}

export interface AdminRole {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean;
  isSystemRole?: boolean;
  isActive?: boolean;
  permissions: string[] | AdminPermission[];
  groupedPermissions?: AdminGroupedPermission[];
  permissionDetails?: AdminPermission[];
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: AdminRole;
  isSuperAdmin: boolean;
  isActive: boolean;
  permissions: string[];
  lastActivityAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  userId?: string;
  id?: string;
  email?: string;
  fullName?: string;
  isSuperAdmin?: boolean;
  userType?: string;
  role?: AdminRole | string;
  user?: AdminUser;
  admin?: AdminUser;
  permissions?: string[];
  sessionId?: string;
  expiresAt?: string;
}

export interface GetProfileResponseData {
  id: string;
  type: string;
  phone?: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  language?: string;
  createdAt: string;
  updatedAt?: string;
  profile?: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    isSuperAdmin: boolean;
    role: AdminRole;
    lastActivityAt?: string;
    mustResetPassword?: boolean;
  };
  stats?: Record<string, number>;
  permissions?: string[];
}

export interface RefreshTokenResponseData {
  accessToken: string;
  expiresAt?: string;
}
