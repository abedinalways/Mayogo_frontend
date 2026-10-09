import { baseApi } from "./baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  CategoryItem,
  CategoryListParams,
  CategoryListResponseData,
  UpdateCategoryPayload,
  ServiceItem,
  ServiceListParams,
  ServiceListResponseData,
  CreateServicePayload,
  UpdateServicePayload,
  ToggleServiceStatusPayload,
} from "@/types/category.types";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryItem[], CategoryListParams | void>({
      query: (params) => ({
        url: "/admin/categories",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (
        response:
          | ApiResponse<CategoryListResponseData | CategoryItem[]>
          | CategoryListResponseData
          | CategoryItem[]
      ): CategoryItem[] => {
        const payload =
          "data" in response && response.data ? response.data : response;

        if (Array.isArray(payload)) {
          return payload as CategoryItem[];
        }

        const obj = payload as CategoryListResponseData;
        return obj.categories || obj.data || obj.items || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Category" as const,
                id,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    getCategoryById: builder.query<CategoryItem, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<CategoryItem> | CategoryItem
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as CategoryItem;
      },
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),

    updateCategory: builder.mutation<ApiResponse<CategoryItem>, UpdateCategoryPayload>({
      query: ({ id, ...body }) => ({
        url: `/admin/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),

    deleteCategory: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    getServices: builder.query<ServiceListResponseData, ServiceListParams | void>({
      query: (params) => ({
        url: "/admin/services",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (
        response:
          | ApiResponse<ServiceListResponseData | ServiceItem[]>
          | ServiceListResponseData
          | ServiceItem[]
      ): ServiceListResponseData => {
        const payload =
          "data" in response && response.data ? response.data : response;

        if (Array.isArray(payload)) {
          return {
            services: payload,
            total: payload.length,
            limit: payload.length,
            offset: 0,
          };
        }

        const obj = payload as ServiceListResponseData;
        return {
          services: obj.services || obj.data || obj.items || [],
          total: obj.total ?? (obj.services?.length || 0),
          limit: obj.limit || 20,
          offset: obj.offset || 0,
        };
      },
      providesTags: (result) =>
        result?.services
          ? [
              ...result.services.map(({ id }) => ({
                type: "Service" as const,
                id,
              })),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),

    createService: builder.mutation<ApiResponse<ServiceItem>, CreateServicePayload>({
      query: (body) => ({
        url: "/admin/services",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Service", id: "LIST" },
        { type: "Category", id: "LIST" },
      ],
    }),

    updateService: builder.mutation<ApiResponse<ServiceItem>, UpdateServicePayload>({
      query: ({ id, ...body }) => ({
        url: `/admin/services/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),

    toggleServiceStatus: builder.mutation<
      ApiResponse<unknown>,
      ToggleServiceStatusPayload
    >({
      query: ({ id, isActive }) => ({
        url: `/admin/services/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),

    deleteService: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/admin/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useToggleServiceStatusMutation,
  useDeleteServiceMutation,
} = categoryApi;
