import {
  createApi,
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

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://mayogo.pixelstack.cloud/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: { accessToken: string | null } }).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
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
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Admin",
    "Expert",
    "Client",
    "Job",
    "Dispute",
    "Category",
    "Service",
    "Content",
    "Verification",
    "Role",
  ],
  endpoints: () => ({}),
});
