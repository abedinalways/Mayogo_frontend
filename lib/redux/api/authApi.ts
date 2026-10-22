import { baseApi } from "@/lib/redux/api/baseApi";
import { setCredentials, setUser, logout } from "@/lib/redux/features/auth/authSlice";
import { ApiResponse } from "@/types/api.types";
import {
  AdminLoginCredentials,
  AdminUser,
  LoginResponseData,
  GetProfileResponseData,
} from "@/types/auth.types";

async function syncAdminRoleCookie(isSuperAdmin: boolean, userId: string) {
  try {
    await fetch("/api/auth-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isSuperAdmin, userId }),
    });
  } catch {
    // Non-fatal
  }
}

async function clearAdminRoleCookie() {
  try {
    await fetch("/api/auth-role", { method: "DELETE" });
  } catch {
    // Non-fatal
  }
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<ApiResponse<LoginResponseData>, AdminLoginCredentials>({
      query: (credentials) => ({
        url: "/auth/admin/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const payload = data.data as any;

          const permissions: string[] = Array.isArray(payload.permissions)
            ? payload.permissions
            : Array.isArray(payload.role?.permissions)
            ? payload.role.permissions
            : [];

          const isSuperAdmin = Boolean(
            payload.isSuperAdmin ?? payload.profile?.isSuperAdmin ?? false
          );

          const user: AdminUser = {
            id: payload.userId || payload.id || "",
            fullName: payload.fullName || payload.profile?.fullName || "Admin User",
            email: payload.email || "",
            phone: payload.phone || "",
            avatar: payload.avatar || payload.profile?.avatarUrl || undefined,
            isSuperAdmin,
            isActive: Boolean(payload.isActive ?? true),
            role: {
              id: payload.role?.id || "admin-role",
              name:
                typeof payload.role === "string"
                  ? payload.role
                  : payload.role?.name || (isSuperAdmin ? "Super Admin" : "Admin"),
              description: payload.role?.description || "",
              permissions: permissions,
            },
            permissions: permissions,
            createdAt: payload.createdAt || new Date().toISOString(),
          };

          dispatch(
            setCredentials({
              user,
              accessToken: payload.accessToken,
            })
          );

          syncAdminRoleCookie(isSuperAdmin, user.id);
        } catch {
          // Handled in caller component
        }
      },
    }),

    getProfile: builder.query<ApiResponse<GetProfileResponseData | AdminUser>, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const raw = data.data as any;

          if (raw) {
            const permissions: string[] = Array.isArray(raw.permissions)
              ? raw.permissions
              : Array.isArray(raw.profile?.role?.permissions)
              ? raw.profile.role.permissions
              : Array.isArray(raw.role?.permissions)
              ? raw.role.permissions
              : [];

            const isSuperAdmin = Boolean(
              raw.profile?.isSuperAdmin ?? raw.isSuperAdmin ?? false
            );

            const user: AdminUser = {
              id: raw.id || raw.userId || "",
              fullName: raw.profile?.fullName || raw.fullName || "Admin User",
              email: raw.email || "",
              phone: raw.phone || "",
              avatar: raw.profile?.avatarUrl || raw.avatar || undefined,
              isSuperAdmin,
              isActive: Boolean(raw.isActive ?? true),
              role: {
                id: raw.profile?.role?.id || raw.role?.id || "admin-role",
                name:
                  typeof raw.role === "string"
                    ? raw.role
                    : raw.profile?.role?.name || raw.role?.name || (isSuperAdmin ? "Super Admin" : "Admin"),
                description: raw.profile?.role?.description || raw.role?.description || "",
                permissions: permissions,
                groupedPermissions: raw.profile?.role?.groupedPermissions,
                permissionDetails: raw.profile?.role?.permissionDetails,
              },
              permissions: permissions,
              lastActivityAt: raw.profile?.lastActivityAt || raw.lastActivityAt,
              createdAt: raw.createdAt || new Date().toISOString(),
              updatedAt: raw.updatedAt,
            };

            dispatch(setUser(user));
            syncAdminRoleCookie(isSuperAdmin, user.id);
          }
        } catch {
          // Failed profile fetch
        }
      },
    }),

    logoutAdmin: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          clearAdminRoleCookie();
        }
      },
    }),

    logoutAllDevices: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout-all",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          clearAdminRoleCookie();
        }
      },
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useLogoutAdminMutation,
  useLogoutAllDevicesMutation,
} = authApi;
