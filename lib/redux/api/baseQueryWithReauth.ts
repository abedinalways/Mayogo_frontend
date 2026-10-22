import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { setAccessToken, logout } from "@/lib/redux/features/auth/authSlice";
import { ApiResponse } from "@/types/api.types";
import { RefreshTokenResponseData } from "@/types/auth.types";

const mutex = new Mutex();

/**
 * Resolves the backend API base URL with fallback to production.
 */
export const getBaseUrl = (): string => {
  const rawUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://mayogo.pixelstack.cloud/api";
  return rawUrl.replace(/\/+$/, "");
};

/**
 * Standard base query configuration with credentials and authorization headers.
 */
export const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as { auth: { accessToken: string | null } }).auth.accessToken;
    // Don't attach authorization header if we're requesting a token refresh
    if (token && endpoint !== "refreshToken") {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Interceptor query with mutex-guarded automatic token refresh on 401 Unauthorized.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "string" ? args : args.url;
  const isAuthEndpoint =
    requestUrl.includes("/auth/refresh") ||
    requestUrl.includes("/auth/admin/login") ||
    requestUrl.includes("/auth/logout");

  if (result.error && result.error.status === 401 && !isAuthEndpoint) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const responseData = refreshResult.data as
            | ApiResponse<RefreshTokenResponseData>
            | RefreshTokenResponseData;

          const newAccessToken =
            "data" in responseData && responseData.data?.accessToken
              ? responseData.data.accessToken
              : "accessToken" in responseData
                ? responseData.accessToken
                : null;

          if (newAccessToken) {
            api.dispatch(setAccessToken(newAccessToken));
            // Retry original query with the refreshed token
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // Wait until the reauth process completes and retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
