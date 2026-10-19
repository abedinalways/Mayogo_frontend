import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
import { TAG_TYPES } from "./tagTypes";


export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [...TAG_TYPES],
  endpoints: () => ({}),
});

export * from "./tagTypes";
export { getBaseUrl } from "./baseQueryWithReauth";
