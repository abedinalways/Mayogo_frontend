import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  CompanySettings,
  UpdateCompanySettingsDto,
  CompanyLogoUploadResponse,
} from "@/types/settings.types";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanySettings: builder.query<CompanySettings, void>({
      query: () => ({
        url: "/admin/settings/general/company",
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<CompanySettings> | CompanySettings
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as CompanySettings;
      },
      providesTags: [{ type: "Settings", id: "COMPANY" }],
    }),

    updateCompanySettings: builder.mutation<
      CompanySettings,
      UpdateCompanySettingsDto
    >({
      query: (body) => ({
        url: "/admin/settings/general/company",
        method: "PATCH",
        body,
      }),
      transformResponse: (
        response: ApiResponse<CompanySettings> | CompanySettings
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as CompanySettings;
      },
      invalidatesTags: [{ type: "Settings", id: "COMPANY" }],
    }),

    uploadCompanyLogo: builder.mutation<
      CompanyLogoUploadResponse,
      FormData | File
    >({
      query: (arg) => {
        let body: FormData;
        if (arg instanceof FormData) {
          body = arg;
        } else {
          body = new FormData();
          body.append("logo", arg);
        }
        return {
          url: "/admin/settings/general/company/logo",
          method: "POST",
          body,
        };
      },
      transformResponse: (
        response:
          | ApiResponse<CompanyLogoUploadResponse>
          | CompanyLogoUploadResponse
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as CompanyLogoUploadResponse;
      },
      invalidatesTags: [{ type: "Settings", id: "COMPANY" }],
    }),

    removeCompanyLogo: builder.mutation<
      { success: boolean; message?: string },
      void
    >({
      query: () => ({
        url: "/admin/settings/general/company/logo",
        method: "DELETE",
      }),
      transformResponse: (
        response: ApiResponse<any> | { success: boolean; message?: string }
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as { success: boolean; message?: string };
      },
      invalidatesTags: [{ type: "Settings", id: "COMPANY" }],
    }),
  }),
});

export const {
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useUploadCompanyLogoMutation,
  useRemoveCompanyLogoMutation,
} = settingsApi;
