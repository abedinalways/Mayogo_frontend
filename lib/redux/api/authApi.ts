import { baseApi } from "@/lib/redux/api/baseApi";
import { setCredentials, setUser, logout } from "@/lib/redux/features/auth/authSlice";
import { ApiResponse } from "@/types/api.types";
import {
  AdminLoginCredentials,
  AdminUser,
  LoginResponseData,
} from "@/types/auth.types";

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
          const payload = data.data;

          const rawUser = payload.user || payload.admin;
          const user: AdminUser = rawUser || {
            id: payload.id || "",
            fullName: payload.fullName || "Admin",
            email: payload.email || "",
            role: typeof payload.role === "object" ? payload.role : {
              id: "admin-role",
              name: (payload.role as string) || "Super Admin",
              isSystemRole: true,
              permissions: [],
            },
            isSuperAdmin: true,
            isActive: true,
            createdAt: new Date().toISOString(),
          };

          dispatch(
            setCredentials({
              user,
              accessToken: payload.accessToken,
            })
          );
        } catch {
          // Handled in caller component
        }
      },
    }),

    getProfile: builder.query<ApiResponse<AdminUser>, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setUser(data.data));
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
