import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  FaqItem,
  FaqListParams,
  CreateFaqPayload,
  UpdateFaqPayload,
  AnnouncementItem,
  AnnouncementListParams,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
  BannerItem,
  BannerListParams,
  CreateBannerPayload,
  UpdateBannerPayload,
  StaticPageItem,
  StaticPageListParams,
  CreateStaticPagePayload,
  UpdateStaticPagePayload,
  ContentStatsResponseData,
} from "@/types/content.types";

function unwrapList<T>(
  response:
    | ApiResponse<T[] | { items?: T[]; data?: T[]; total?: number }>
    | T[]
    | { items?: T[]; data?: T[]; total?: number }
    | unknown
): T[] {
  if (!response || typeof response !== "object") return [];
  const payload =
    "data" in response && (response as { data: unknown }).data
      ? (response as { data: unknown }).data
      : response;
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (typeof payload === "object" && payload !== null) {
    const obj = payload as { items?: T[]; data?: T[] };
    return obj.items || obj.data || [];
  }
  return [];
}

function unwrapSingle<T extends object>(
  response: ApiResponse<T> | T | unknown
): T {
  if (!response || typeof response !== "object") return {} as T;
  if ("data" in response && (response as ApiResponse<T>).data) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
}

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContentStats: builder.query<ContentStatsResponseData, void>({
      query: () => ({
        url: "/admin/content/stats",
        method: "GET",
      }),
      transformResponse: (response) =>
        unwrapSingle<ContentStatsResponseData>(response),
      providesTags: [{ type: "Content" as const, id: "STATS" }],
    }),

    // FAQs
    getFaqs: builder.query<FaqItem[], FaqListParams | void>({
      query: (params) => ({
        url: "/admin/content/faqs",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (response) => unwrapList<FaqItem>(response),
      providesTags: (result) =>
        result
          ? [
              { type: "Content" as const, id: "FAQS_LIST" },
              ...result.map((item) => ({
                type: "Content" as const,
                id: `FAQ_${item.id}`,
              })),
            ]
          : [{ type: "Content" as const, id: "FAQS_LIST" }],
    }),

    getFaqById: builder.query<FaqItem, string>({
      query: (faqId) => ({
        url: `/admin/content/faqs/${faqId}`,
        method: "GET",
      }),
      transformResponse: (response) => unwrapSingle<FaqItem>(response),
      providesTags: (_res, _err, id) => [
        { type: "Content" as const, id: `FAQ_${id}` },
      ],
    }),

    createFaq: builder.mutation<FaqItem, CreateFaqPayload>({
      query: (body) => ({
        url: "/admin/content/faqs",
        method: "POST",
        body,
      }),
      transformResponse: (response) => unwrapSingle<FaqItem>(response),
      invalidatesTags: [
        { type: "Content" as const, id: "FAQS_LIST" },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    updateFaq: builder.mutation<FaqItem, UpdateFaqPayload>({
      query: ({ faqId, ...body }) => ({
        url: `/admin/content/faqs/${faqId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => unwrapSingle<FaqItem>(response),
      invalidatesTags: (_res, _err, { faqId }) => [
        { type: "Content" as const, id: "FAQS_LIST" },
        { type: "Content" as const, id: `FAQ_${faqId}` },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    deleteFaq: builder.mutation<unknown, string>({
      query: (faqId) => ({
        url: `/admin/content/faqs/${faqId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Content" as const, id: "FAQS_LIST" },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    // Announcements
    getAnnouncements: builder.query<
      AnnouncementItem[],
      AnnouncementListParams | void
    >({
      query: (params) => ({
        url: "/admin/content/announcements",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (response) => unwrapList<AnnouncementItem>(response),
      providesTags: (result) =>
        result
          ? [
              { type: "Content" as const, id: "ANNOUNCEMENTS_LIST" },
              ...result.map((item) => ({
                type: "Content" as const,
                id: `ANN_${item.id}`,
              })),
            ]
          : [{ type: "Content" as const, id: "ANNOUNCEMENTS_LIST" }],
    }),

    getAnnouncementById: builder.query<AnnouncementItem, string>({
      query: (announcementId) => ({
        url: `/admin/content/announcements/${announcementId}`,
        method: "GET",
      }),
      transformResponse: (response) => unwrapSingle<AnnouncementItem>(response),
      providesTags: (_res, _err, id) => [
        { type: "Content" as const, id: `ANN_${id}` },
      ],
    }),

    createAnnouncement: builder.mutation<
      AnnouncementItem,
      CreateAnnouncementPayload
    >({
      query: (body) => ({
        url: "/admin/content/announcements",
        method: "POST",
        body,
      }),
      transformResponse: (response) => unwrapSingle<AnnouncementItem>(response),
      invalidatesTags: [
        { type: "Content" as const, id: "ANNOUNCEMENTS_LIST" },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    updateAnnouncement: builder.mutation<
      AnnouncementItem,
      UpdateAnnouncementPayload
    >({
      query: ({ announcementId, ...body }) => ({
        url: `/admin/content/announcements/${announcementId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => unwrapSingle<AnnouncementItem>(response),
      invalidatesTags: (_res, _err, { announcementId }) => [
        { type: "Content" as const, id: "ANNOUNCEMENTS_LIST" },
        { type: "Content" as const, id: `ANN_${announcementId}` },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    deleteAnnouncement: builder.mutation<unknown, string>({
      query: (announcementId) => ({
        url: `/admin/content/announcements/${announcementId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Content" as const, id: "ANNOUNCEMENTS_LIST" },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    // Homepage Banners
    getBanners: builder.query<BannerItem[], BannerListParams | void>({
      query: (params) => ({
        url: "/admin/content/banners",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (response) => unwrapList<BannerItem>(response),
      providesTags: (result) =>
        result
          ? [
              { type: "Content" as const, id: "BANNERS_LIST" },
              ...result.map((item) => ({
                type: "Content" as const,
                id: `BANNER_${item.id}`,
              })),
            ]
          : [{ type: "Content" as const, id: "BANNERS_LIST" }],
    }),

    getBannerById: builder.query<BannerItem, string>({
      query: (bannerId) => ({
        url: `/admin/content/banners/${bannerId}`,
        method: "GET",
      }),
      transformResponse: (response) => unwrapSingle<BannerItem>(response),
      providesTags: (_res, _err, id) => [
        { type: "Content" as const, id: `BANNER_${id}` },
      ],
    }),

    createBanner: builder.mutation<BannerItem, CreateBannerPayload>({
      query: (body) => ({
        url: "/admin/content/banners",
        method: "POST",
        body,
      }),
      transformResponse: (response) => unwrapSingle<BannerItem>(response),
      invalidatesTags: [
        { type: "Content" as const, id: "BANNERS_LIST" },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    updateBanner: builder.mutation<BannerItem, UpdateBannerPayload>({
      query: ({ bannerId, ...body }) => ({
        url: `/admin/content/banners/${bannerId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => unwrapSingle<BannerItem>(response),
      invalidatesTags: (_res, _err, { bannerId }) => [
        { type: "Content" as const, id: "BANNERS_LIST" },
        { type: "Content" as const, id: `BANNER_${bannerId}` },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    deleteBanner: builder.mutation<unknown, string>({
      query: (bannerId) => ({
        url: `/admin/content/banners/${bannerId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Content" as const, id: "BANNERS_LIST" },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    // Static Pages
    getStaticPages: builder.query<StaticPageItem[], StaticPageListParams | void>({
      query: (params) => ({
        url: "/admin/content/pages",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (response) => unwrapList<StaticPageItem>(response),
      providesTags: (result) =>
        result
          ? [
              { type: "Content" as const, id: "PAGES_LIST" },
              ...result.map((item) => ({
                type: "Content" as const,
                id: `PAGE_${item.id}`,
              })),
            ]
          : [{ type: "Content" as const, id: "PAGES_LIST" }],
    }),

    getStaticPageById: builder.query<StaticPageItem, string>({
      query: (pageId) => ({
        url: `/admin/content/pages/${pageId}`,
        method: "GET",
      }),
      transformResponse: (response) => unwrapSingle<StaticPageItem>(response),
      providesTags: (_res, _err, id) => [
        { type: "Content" as const, id: `PAGE_${id}` },
      ],
    }),

    createStaticPage: builder.mutation<
      StaticPageItem,
      CreateStaticPagePayload
    >({
      query: (body) => ({
        url: "/admin/content/pages",
        method: "POST",
        body,
      }),
      transformResponse: (response) => unwrapSingle<StaticPageItem>(response),
      invalidatesTags: [
        { type: "Content" as const, id: "PAGES_LIST" },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    updateStaticPage: builder.mutation<
      StaticPageItem,
      UpdateStaticPagePayload
    >({
      query: ({ pageId, ...body }) => ({
        url: `/admin/content/pages/${pageId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => unwrapSingle<StaticPageItem>(response),
      invalidatesTags: (_res, _err, { pageId }) => [
        { type: "Content" as const, id: "PAGES_LIST" },
        { type: "Content" as const, id: `PAGE_${pageId}` },
        { type: "Content" as const, id: "STATS" },
      ],
    }),

    deleteStaticPage: builder.mutation<unknown, string>({
      query: (pageId) => ({
        url: `/admin/content/pages/${pageId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Content" as const, id: "PAGES_LIST" },
        { type: "Content" as const, id: "STATS" },
      ],
    }),
  }),
});

export const {
  useGetContentStatsQuery,
  useGetFaqsQuery,
  useGetFaqByIdQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useGetAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useGetStaticPagesQuery,
  useGetStaticPageByIdQuery,
  useCreateStaticPageMutation,
  useUpdateStaticPageMutation,
  useDeleteStaticPageMutation,
} = contentApi;
