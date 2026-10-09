export interface AdminPermission {
  id: string;
  name: string;
  module: string;
  action: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  permissions: AdminPermission[];
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
  user: AdminUser;
}

export interface RefreshTokenResponseData {
  accessToken: string;
}
